import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, slugifyFilePath, FilePath } from "../util/path"

interface Options {
  tag: string      // only list pages with this tag
  limit: number
}

export default ((userOpts?: Partial<Options>) => {
  const opts: Options = { tag: "news", limit: 10, ...userOpts }

  const PageCards: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    if (fileData.slug !== "index") return null // homepage only

    const pages = allFiles
      .filter((f) => f.frontmatter?.tags?.includes(opts.tag))
      .sort((a, b) => (b.dates?.created?.getTime() ?? 0) - (a.dates?.created?.getTime() ?? 0))
      .slice(0, opts.limit)

    return (
      <ul class="page-cards">
        {pages.map((page) => {
          const img = (page.frontmatter as any)?.image as string | undefined
          const imgSrc = img
            ? resolveRelative(fileData.slug!, slugifyFilePath(img as FilePath) as any)
            : undefined
          return (
            <li>
              <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                {imgSrc && <img src={imgSrc} alt={page.frontmatter?.title} loading="lazy" />}
                <span>{page.frontmatter?.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    )
  }

  PageCards.css = `
  .page-cards { list-style: none; padding: 0; display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
  .page-cards li { margin: 0; }
  .page-cards a { display: block; text-decoration: none; background: transparent; }
  .page-cards img { width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 6px; margin: 0 0 .4rem; }
  `
  return PageCards
}) satisfies QuartzComponentConstructor