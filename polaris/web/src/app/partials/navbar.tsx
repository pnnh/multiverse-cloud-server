import Link from 'next/link'
import styles from './navbar.module.scss'
import { fullAuthUrl } from '@/services/common/const'

export function PublicNavbar (props: {authServer:string, selfUrl: string, account?: string }) {
  return <div className={styles.navHeader}>
    <div className={styles.leftNav}>
      <Link className={styles.brandLink} href={'/'}>首页</Link>
      <Link className={styles.brandLink} href={'/content/channel'}>频道</Link>
    </div>
    <div className={styles.rightNav}>
      <UserAction authServer={props.authServer} selfUrl={props.selfUrl} account={props.account} />
    </div>
  </div>
}

function UserAction (props: {authServer:string, selfUrl: string, account?: string }) {
  if (!props.account) {
    const clientAuthUrl = fullAuthUrl(props.authServer, props.selfUrl, '/')
    return <Link
      href={clientAuthUrl} className={styles.loginLink}>登录</Link>
  }
  return <div>
    <Link className={styles.loginLink} href={'/console'}>{props.account}</Link>
  </div>
}