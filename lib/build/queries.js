"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATIC_PAYLOAD_QUERY = exports.TYPE_RESOLUTION_QUERY = void 0;
const TYPE_RESOLUTION_QUERY = `
query TypeResolution($links: [String!]!) {
    typesForLinks(links: $links) {
        type
        link
    }
}
`;
exports.TYPE_RESOLUTION_QUERY = TYPE_RESOLUTION_QUERY;
const STATIC_PAYLOAD_QUERY = `
query StaticBuild {
    staticBuild {
      links {
          link
      }
    }
  }    
`;
exports.STATIC_PAYLOAD_QUERY = STATIC_PAYLOAD_QUERY;
//# sourceMappingURL=queries.js.map