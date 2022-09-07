import { ProjectCard as Card } from '@/components/Card'
import { Layout } from '@/layouts'
import Cover from '@/public/images/tools.webp'
import config from '@/site.config'
import React from 'react'

export default function Projects(props) {
  return (
    <Layout {...props} title='Projects' coverImage={Cover}>
      <div className='margin-auto text-black dark:text-gray-100 grid sm:grid-cols-2 gap-responsive'>
        {config.projects.map((d) => (
          <Card
            key={d.title}
            title={d.title}
            description={d.description}
            coverImage={d.coverImage}
            href={d.href}
          />
        ))}
      </div>
    </Layout>
  )
}
