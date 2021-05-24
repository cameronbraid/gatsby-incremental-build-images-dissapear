import * as React from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import { graphql, useStaticQuery } from "gatsby"

const IndexPage = () => {

  const data = useStaticQuery(graphql`
    query MyQuery {
      allFile {
        edges {
          node {
            name
            childImageSharp {
              gatsbyImageData(width: 150)
            }
          }
        }
      }
      allMyContent {
        edges {
          node {
            url
            urlImage {
              childImageSharp {
                gatsbyImageData(width: 150)
              }
            }
          }
        }
      }

    }
  `)

  return (
    <div>
      <h1>from file</h1>
      {data.allFile.edges.map((edge,i)=>(
        <div>
          <h2>{edge.node.name}</h2>
          <GatsbyImage
            key={i}
            image={edge.node.childImageSharp.gatsbyImageData}
          />
        </div>
      ))}

      <h1>from content</h1>
      {data.allMyContent.edges.map((edge,i)=>(
        <div>
          <h2>{edge.node.url}</h2>
          {edge.node.urlImage.childImageSharp ? <GatsbyImage
            key={i}
            image={edge.node.urlImage.childImageSharp.gatsbyImageData}
          /> : <>no image</>}
        </div>
      ))}
    </div>

  )
}

export default IndexPage
