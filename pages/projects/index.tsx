import { ProjectCard as Card } from '@/components/Card'
import { Layout } from '@/layouts'
import config from '@/site.config'
import { domain, rootNotionPageId } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { PageProps, Params } from 'lib/types'
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = (context.params?.pageId ?? rootNotionPageId) as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function Projects(props) {
  return (
    <Layout {...props} title='Projects' coverImage='/images/tools.webp'>
      <div className='margin-auto card text-black dark:text-gray-100 grid sm:grid-cols-2 gap-responsive'>
        {config.toolList.map((d) => (
          <Card
            key={d.title}
            title={d.title}
            description={d.description}
            imgSrc={d.imgSrc}
            href={d.href}
          />
        ))}
      </div>
    </Layout>
  )
}
