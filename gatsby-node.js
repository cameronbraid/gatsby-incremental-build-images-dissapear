const { createRemoteFileNode } = require("gatsby-source-filesystem")
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
const graphql = String.raw

exports.createSchemaCustomization = (api, options) => {

  let {
    cache,
    store,
    reporter,
    createContentDigest,
    createNodeId,
    actions : {
      createTypes,
      createFieldExtension,
      createNode,
      deleteNode,
      createParentChildLink,
      createNodeField,
    },
  } = api


  createFieldExtension({
    name: "remoteFile",
    args: {
      from: {
        type: "String!",
      },
    },

    extend(options, prevFieldConfig) {
      return {
        args: {},
        type: 'File',
        async resolve(source, args, context, info) {

          let url = source[options.from]
          if (!url) return null


          let error = null

          try {
            let node = context.nodeModel.getAllNodes({type:"File"}).find(f=>f.url == url)

            let file = await createRemoteFileNode({
              url,
              parentNodeId: source.id,
              createNode,
              createNodeId,
              cache,
              store,
              reporter,
            })

            // createRemoteFileNode doesn't preserve the children field which clobbers existing childImageSharp
            if (node) file.children = node.children

            return file

          }
          catch (e) {
            error = e
          }

          reporter.warn(error ? error.toString() : `Unable to resolve url`)
          
          return null

        },
      }
    },
  })

  createTypes(graphql`

    type MyContent implements Node {
      urlImage: File @remoteFile(from:"url")
    }

  `)


}



exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  // Data can come from anywhere, but for now create it manually
  const myData = {
    key: 123,
    url: "https://via.placeholder.com/350x150",
  }

  const nodeContent = JSON.stringify(myData)

  const nodeMeta = {
    id: createNodeId(`MyContent-${myData.key}`),
    parent: null,
    children: [],
    internal: {
      type: `MyContent`,
      content: nodeContent,
      contentDigest: createContentDigest(myData)
    }
  }

  createNode({
    ...myData,
    ...nodeMeta,
  })
}
