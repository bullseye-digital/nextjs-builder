declare const TYPE_RESOLUTION_QUERY = "\nquery TypeResolution($links: [String!]!) {\n    typesForLinks(links: $links) {\n        type\n        link\n    }\n}\n";
declare const STATIC_PAYLOAD_QUERY = "\nquery StaticBuild {\n    staticBuild {\n      links {\n          link\n      }\n    }\n  }    \n";
export { TYPE_RESOLUTION_QUERY, STATIC_PAYLOAD_QUERY, };
