import * as React from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import { graphql, useStaticQuery } from "gatsby"

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query MyQuery {
      allFile(filter: { name: { eq: "rail" } }) {
        edges {
          node {
            id
            childImageSharp {
              gatsbyImageData(
                layout: FIXED
                width: 200
                transformOptions: { fit: CONTAIN }
                backgroundColor: "transparent"
                placeholder: BLURRED
                blurredOptions: { toFormat: PNG }
                formats: [AUTO, WEBP]
              )
            }
          }
        }
      }
    }
  `)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row"
      }}
    >
      <GatsbyImage
        image={data.allFile.edges[0].node.childImageSharp.gatsbyImageData}
      />
    </div>
  )
}

export default IndexPage
