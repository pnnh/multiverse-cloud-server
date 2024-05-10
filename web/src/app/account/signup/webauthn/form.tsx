'use client'

import React, {useState} from 'react'
import styles from './form.module.scss'
import {handleSignInSubmit} from '@/services/client/webauthn'
import { Button, Input } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export 
function WebauthnForm ({authServer, rawQuery}: {authServer: string, rawQuery: string}) {
  const [username, setUsername] = useState('')
  const [errorMessage] = useState('')
  const webauthnFormUrl = `${authServer}/account/signin/webauthn/finish/${username}?`+rawQuery
                    
  const [verifyData, setVerifyData] = useState('')
  const formRef = React.useRef<HTMLFormElement>(null)
  return <form method={'POST'} action={webauthnFormUrl} ref={formRef}>
  <input type="hidden" name="verifyData" value={verifyData} />
  <div className={styles.fieldRow}>
                <Input className="input input-bordered w-full" type="text" placeholder="输入用户名"
                       value={username} onChange={(event) => {
                         setUsername(event.target.value)
                       }}/>
                       <span className={styles.verifyButton} title='认证秘钥' onClick={async () => {
                        
                         setVerifyData('')
                         handleSignInSubmit(authServer, username).then((verifyData:string|undefined) => {
                    
                           if (!verifyData) {
                             console.log('登陆失败')
                             return
                           }
                           console.log('登陆成功')
                      
                           setVerifyData(verifyData)
                           // formRef.current?.submit()
                         })
                       }}><ArrowForwardIcon/></span> 
            </div>

 
            {
              verifyData && <div className={styles.actionRow}>
              <Button type={'submit'}>认证成功确认登录</Button>
          </div>
            }
            
            {errorMessage &&
                <div className={styles.messageRow}>
                    <span>{errorMessage}</span>
                </div>
            }
  </form>
}