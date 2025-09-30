import { GetStaticProps } from "next"
import { CoreQueries } from "../../types"
import {
  resolveAncestry,
  linkify,
} from "@silverstripe/nextjs-toolkit"
import { TYPE_RESOLUTION_QUERY } from "../build/queries"
import createGetQueryForType from "../build/createGetQueryForType"
import createClient from "../graphql/createClient"
import { ProjectState } from "@silverstripe/nextjs-toolkit"

// Formats current time in a given IANA timezone as "YYYY-MM-DD HH:mm:SS"
const nowInTimeZone = (timeZone: string): string => {
  const d = new Date()

  // Get date/time parts in the target timezone
  const dtf = new Intl.DateTimeFormat("en-NZ", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
  const parts = dtf.formatToParts(d)

  // Return date-time without timezone, e.g. "2025-09-26 06:58:00"
  const map: Record<string, string> = Object.fromEntries(parts.map(p => [p.type, p.value]))
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`
}

const getStaticProps = (project: ProjectState): GetStaticProps => async context => {
  const getQueryForType = createGetQueryForType(project)
  const api = createClient(project.projectConfig)
  const { getPropsManifest, typeAncestry, availableTemplates } = project.cacheManifest
  const page = context?.params?.page ?? []
  let url
  if (Array.isArray(page)) {
    url = page.join(`/`)
  } else {
    url = page
  }

  url = linkify(url)

  if (url.match(/\.[^\/]+$/)) {
    console.log(`Not found:`, url)
    return {
      notFound: true,
    }
  }
  if (!availableTemplates) {
    throw new Error(`No available templates found`)
  }

  const templates = Object.keys(availableTemplates)
  
  try {
    const typeResolutionResult: CoreQueries = await api.query(
      TYPE_RESOLUTION_QUERY,
      { links: [url] }
    )

    if (
      !typeResolutionResult ||
      typeResolutionResult.typesForLinks.length === 0
    ) {
      return {
        notFound: true,
      }
    }

    const data = {
      query: null,
      extraProps: null,
    }

    const result = typeResolutionResult.typesForLinks[0]
    const { type } = result
    // @ts-ignore
    const ancestors = typeAncestry[type] ?? []
    const stage = context.draftMode ? `DRAFT` : `LIVE`
    const now = nowInTimeZone("Pacific/Auckland")
    const queryStr = getQueryForType(type)
    if (queryStr) {
      // Provide an optional `$now` variable for queries that use it.
      // Servers ignore extra variables if not declared in the operation.
      data.query = (await api.query(queryStr, { link: url, stage, now })) ?? null
    }

    const propsKey = resolveAncestry(
      type,
      ancestors,
      Object.keys(getPropsManifest)
    )
    // @ts-ignore
    const propsFunc = propsKey ? getPropsManifest[propsKey] ?? null : null
    if (propsFunc) {
      data.extraProps = await propsFunc(data.query)
    }


    let basePageData = null
    if(data.query) {
      for (const key in (data.query as any)) {
        const leObj:any = (data.query as any)[key];
        if(leObj.basePageData) {
          basePageData = JSON.parse(leObj.basePageData)
        }
      }
    }
    if( basePageData!==null && stage!==`DRAFT`) {
      if(basePageData.isPublishedInTheFuture) {
        console.log('IS 404 ... ')
        return {
          notFound: true,
        }
      }
    }


    const componentProps = {
      props: {
        data,
        type,
        templates,
      },
      revalidate: 300 // 900 // 15 minutes
    }
    return componentProps

  // might be not found  
  } catch(err) {

    // @ts-ignore
    if( typeof (err.message as string) !== 'undefined' && (err.message as string).includes('could not be found') ) { 
      return {
        notFound: true,
      }
    }
    
    throw err
  }
}

export default getStaticProps
