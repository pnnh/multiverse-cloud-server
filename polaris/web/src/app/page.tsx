import React from 'react'
import { PublicNavbar } from './partials/navbar'
import styles from './page.module.scss'
import Link from 'next/link'
import { calcPagination } from '~/@pnnh/stele/esm/utils/helpers'
import { PaginationPartial } from '@/components/common/pagination'
import { replaceSearchParams } from '@/utils/query'
import queryString from 'query-string'
import { ArticleModel } from '@/models/article'
import { NoData } from '@/components/common/empty'
import { PSImage } from '@/components/client/image'
import { getIdentity } from '@/services/auth'
import { formatRfc3339 } from '@/utils/datetime'
import { subString } from '~/@pnnh/stele/esm/utils/string'
import { loadServerConfig } from '@/services/server/config'
import { ArticleService, articleContentViewUrl } from '@/services/article'

export default async function Home ({ searchParams }: {
  searchParams: Record<string, string>
}) {
  let page = Number(searchParams.page)
  if (isNaN(page)) {
    page = 1
  }
  const pageSize = 10
  const serverConfig = await loadServerConfig()
  const rawQuery = queryString.stringify(searchParams)
  const articleService = ArticleService.Instance(serverConfig.SERVER)
  const articles = await articleService.selectArticles(rawQuery)

  const pagination = calcPagination(page, articles.count, pageSize)
  const sortClass = (sort: string) => {
    const querySort = (searchParams.sort ?? 'latest')
    return ' ' + (querySort === sort ? styles.activeLink : '')
  }
  const filterClass = (filter: string) => {
    const queryFilter = (searchParams.filter ?? 'all')
    return ' ' + (queryFilter === filter ? styles.activeLink : '')
  }

  const identity = await getIdentity()
  return <div className={styles.indexPage}>
    <div>
      <PublicNavbar authServer={serverConfig.AUTH_SERVER} selfUrl={serverConfig.SELF_URL} account={identity}/>
    </div>
    <div className={styles.container}>
      <div className={styles.conMiddle}>
        <div className={styles.middleTop}>
          <div className={styles.topLeft}>
            <Link className={styles.sortLink + sortClass('latest')}
              href={replaceSearchParams(searchParams, 'sort', 'latest')}>最新</Link>
            <Link className={styles.sortLink + sortClass('read')}
              href={replaceSearchParams(searchParams, 'sort', 'read')}>阅读数</Link>
          </div>
          <div className={styles.topRight}>
            <Link className={styles.filterLink + filterClass('month')}
              href={replaceSearchParams(searchParams, 'filter', 'month')}>一月内</Link>
            <Link className={styles.filterLink + filterClass('year')}
              href={replaceSearchParams(searchParams, 'filter', 'year')}>一年内</Link>
            <Link className={styles.filterLink + filterClass('all')}
              href={replaceSearchParams(searchParams, 'filter', 'all')}>所有</Link>
          </div>
        </div>
        <div className={styles.middleBody}>
          <MiddleBody articles={articles} />
        </div>
        <div className={styles.middlePagination}>
          <PaginationPartial pagination={pagination} calcUrl={(page) => replaceSearchParams(searchParams, 'page', page.toString())} />
        </div>
      </div>
    </div>
  </div>
}

function MiddleBody (props: { articles: { range: ArticleModel[], count: number } }) {
  if (!props.articles || !props.articles.range || props.articles.range.length === 0) {
    return <NoData size='large' />
  }
  return props.articles.range.map((model) => {
    return <div className={styles.middleItem} key={model.relation}>
      <div className={styles.itemDetail}>
        <div className={styles.title}>
          <Link href={articleContentViewUrl(model.channel, model.pk)}>{model.title}</Link></div>
        <div className={styles.description} title={model.description}>
          {subString(model.description, 100)}
        </div>
        <div className={styles.action}>
          <span><i className="bi bi-eye"></i>&nbsp;{model.discover}</span>&nbsp;
          <span><i className="bi bi-clock"></i>&nbsp;{formatRfc3339(model.update_time)}</span>
        </div>
      </div>
      <div className={styles.itemCover}>
        <PSImage src={model.cover} alt={model.title} fill={true}/>
      </div>

    </div>
  })
}
