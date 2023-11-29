'use client'

import React, {Component } from 'react'
import PropTypes from 'prop-types'
import './captcha_button.css'
import GoCaptcha from './captcha'
import Popover from '@mui/material/Popover'
import Image from '~/next/image'

export interface CaptchaButtonProps {
  value: string,
  title: string,
  //popoverVisible: boolean,
  //captStatus: string,
  imageBase64: string,
  thumbBase64: string,
  height: string,
  width: string,
  class: string,
  maxDot: number, 
  changeValue: (value: string) => void,
  refresh: () => void,
  confirm: (dots: {x:number, y:number}[]) => void
}

export interface CaptchaButtonState {
  popoverVisible: boolean,
  captStatus: string,
  imageBase64: string,
  thumbBase64: string
  title: string,
  anchorEl: null | HTMLElement
}

export default class GoCaptchaBtn extends Component<CaptchaButtonProps, CaptchaButtonState> {
  static defaultProps = {
    value: PropTypes.oneOf(['default', 'check', 'error', 'over', 'overing', 'success']),
    width: '300px',
    height: '50px',
    maxDot: PropTypes.number,
    imageBase64: PropTypes.string,
    thumbBase64: PropTypes.string
  }

  constructor (props: CaptchaButtonProps) {
    super(props)
    this.state = {
      popoverVisible: false,
      captStatus: 'default',
      imageBase64: '',
      thumbBase64: '',
      title: props.title,
      anchorEl: null
    }
  }

  render () {
    const {
      popoverVisible,
      captStatus,
      imageBase64,
      thumbBase64
    } = this.state
    const {
      width,
      height
    } = this.props
 
    const id = this.state.popoverVisible ? 'simple-popover' : undefined

    return <div className="wg-cap-btn" style={{
      width,
      height
    }}>
          <div className={(`wg-cap-btn__inner wg-cap-active__${captStatus}`)}>
            
                    <div>

                <div onClick={(event) => {
                  this.setState({ 
                    anchorEl: event.currentTarget,
                    popoverVisible: true
                  })
                  this.props.refresh && this.props.refresh()
                } } className="wg-cap-state__default">
                <div className="wg-cap-state__inner">
                  <span className="wg-cap-btn__text">{this.state.title}</span>
                </div>
              </div>
              <div onClick={(e) => {
                // 阻止合成事件的冒泡
                e.stopPropagation()
                // 阻止与原生事件的冒泡
                e.nativeEvent.stopImmediatePropagation()
                return false
              }} className="wg-cap-state__check">
                <div className="wg-cap-state__inner">
                  <div className="wg-cap-btn__ico">
                    <Image
                        src="data:image/svg+xml;base64,PHN2ZyB0PSIxNjI3MDU1NTg2NTk0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyMTEiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMTIwLjI1OTQ1NiA1MTIuMDAxMDIzbS0xMTcuOTIzNzYgMGExMTUuMjM4IDExNS4yMzggMCAxIDAgMjM1Ljg0NzUxOSAwIDExNS4yMzggMTE1LjIzOCAwIDEgMC0yMzUuODQ3NTE5IDBaIiBwLWlkPSIxMjEyIiBmaWxsPSIjZmZhMDAwIj48L3BhdGg+PHBhdGggZD0iTTUxMS45OTk0ODggNTEyLjAwMTAyM20tMTE3LjkyMTcxMyAwYTExNS4yMzYgMTE1LjIzNiAwIDEgMCAyMzUuODQzNDI2IDAgMTE1LjIzNiAxMTUuMjM2IDAgMSAwLTIzNS44NDM0MjYgMFoiIHAtaWQ9IjEyMTMiIGZpbGw9IiNmZmEwMDAiPjwvcGF0aD48cGF0aCBkPSJNOTAzLjczOTUyMSA1MTIuMDAxMDIzbS0xMTcuOTIzNzYgMGExMTUuMjM4IDExNS4yMzggMCAxIDAgMjM1Ljg0NzUxOSAwIDExNS4yMzggMTE1LjIzOCAwIDEgMC0yMzUuODQ3NTE5IDBaIiBwLWlkPSIxMjE0IiBmaWxsPSIjZmZhMDAwIj48L3BhdGg+PC9zdmc+"
                        alt=""
                        width={32}
                        height={32}/>
                  </div>
                  <span className="wg-cap-btn__text">正在进行人机验证...</span>
                </div>
              </div>
              <div onClick={(event) => {
                this.setState({ 
                  anchorEl: event.currentTarget,
                  popoverVisible: true
                })
                this.props.refresh && this.props.refresh()
              } } className="wg-cap-state__error">
                <div className="wg-cap-state__inner">
                  <div className="wg-cap-btn__ico">
                    <Image
                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMDAgMjAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0VENDYzMDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xODQsMjYuNkwxMDIuNCwyLjFoLTQuOUwxNiwyNi42Yy0zLjMsMS42LTUuNyw0LjktNS43LDguMnY0OS44YzAsNTIuMiwzMi42LDk0LjcsODcuMywxMTIuNgoJYzAuOCwwLDEuNiwwLjgsMi40LDAuOHMxLjYsMCwyLjQtMC44YzU0LjctMTgsODcuMy01OS42LDg3LjMtMTEyLjZWMzQuN0MxODkuOCwzMS41LDE4Ny4zLDI4LjIsMTg0LDI2LjZ6IE0xMzQuNSwxMjMuMQoJYzMuMSwzLjEsMy4xLDguMiwwLDExLjNjLTEuNiwxLjYtMy42LDIuMy01LjcsMi4zcy00LjEtMC44LTUuNy0yLjNMMTAwLDExMS4zbC0yMy4xLDIzLjFjLTEuNiwxLjYtMy42LDIuMy01LjcsMi4zCgljLTIsMC00LjEtMC44LTUuNy0yLjNjLTMuMS0zLjEtMy4xLTguMiwwLTExLjNMODguNywxMDBMNjUuNSw3Ni45Yy0zLjEtMy4xLTMuMS04LjIsMC0xMS4zYzMuMS0zLjEsOC4yLTMuMSwxMS4zLDBMMTAwLDg4LjcKCWwyMy4xLTIzLjFjMy4xLTMuMSw4LjItMy4xLDExLjMsMGMzLjEsMy4xLDMuMSw4LjIsMCwxMS4zTDExMS4zLDEwMEwxMzQuNSwxMjMuMXoiLz4KPC9zdmc+Cg=="
                        alt="失败"
                        width={32}
                        height={32}/>
                  </div>
                  <span>人机验证失败 <em>点击重试</em></span>
                </div>
              </div>
              <div onClick={(event) => {
                this.setState({ 
                  anchorEl: event.currentTarget,
                  popoverVisible: true
                })
                this.props.refresh && this.props.refresh()
              } } className="wg-cap-state__over">
                <div className="wg-cap-state__inner">
                  <div className="wg-cap-btn__ico">
                    <Image
                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMDAgMjAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0VENDYzMDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xODQsMjYuNkwxMDIuNCwyLjFoLTQuOUwxNiwyNi42Yy0zLjMsMS42LTUuNyw0LjktNS43LDguMnY0OS44YzAsNTIuMiwzMi42LDk0LjcsODcuMywxMTIuNgoJYzAuOCwwLDEuNiwwLjgsMi40LDAuOHMxLjYsMCwyLjQtMC44YzU0LjctMTgsODcuMy01OS42LDg3LjMtMTEyLjZWMzQuN0MxODkuOCwzMS41LDE4Ny4zLDI4LjIsMTg0LDI2LjZ6IE0xMzQuNSwxMjMuMQoJYzMuMSwzLjEsMy4xLDguMiwwLDExLjNjLTEuNiwxLjYtMy42LDIuMy01LjcsMi4zcy00LjEtMC44LTUuNy0yLjNMMTAwLDExMS4zbC0yMy4xLDIzLjFjLTEuNiwxLjYtMy42LDIuMy01LjcsMi4zCgljLTIsMC00LjEtMC44LTUuNy0yLjNjLTMuMS0zLjEtMy4xLTguMiwwLTExLjNMODguNywxMDBMNjUuNSw3Ni45Yy0zLjEtMy4xLTMuMS04LjIsMC0xMS4zYzMuMS0zLjEsOC4yLTMuMSwxMS4zLDBMMTAwLDg4LjcKCWwyMy4xLTIzLjFjMy4xLTMuMSw4LjItMy4xLDExLjMsMGMzLjEsMy4xLDMuMSw4LjIsMCwxMS4zTDExMS4zLDEwMEwxMzQuNSwxMjMuMXoiLz4KPC9zdmc+Cg=="
                        alt="失败"
                        width={32}
                        height={32}/>
                  </div>
                  <span>点击次数过多 <em>点击重试</em></span>
                </div>
              </div> 
              <div onClick={(e) => {
                // 阻止合成事件的冒泡
                e.stopPropagation()
                // 阻止与原生事件的冒泡
                e.nativeEvent.stopImmediatePropagation()
                return false
              }} className="wg-cap-state__success">
                <div className="wg-cap-state__inner">
                  <div className="wg-cap-btn__ico">
                    <Image
                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMDAgMjAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzVFQUEyRjt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xODMuMywyNy4yTDEwMi40LDIuOWgtNC45TDE2LjcsMjcuMkMxMy40LDI4LjgsMTEsMzIsMTEsMzUuM3Y0OS40YzAsNTEuOCwzMi40LDkzLjksODYuNiwxMTEuNwoJYzAuOCwwLDEuNiwwLjgsMi40LDAuOGMwLjgsMCwxLjYsMCwyLjQtMC44YzU0LjItMTcuOCw4Ni42LTU5LjEsODYuNi0xMTEuN1YzNS4zQzE4OSwzMiwxODYuNiwyOC44LDE4My4zLDI3LjJ6IE0xNDYuMSw4MS40CglsLTQ4LjUsNDguNWMtMS42LDEuNi0zLjIsMi40LTUuNywyLjRjLTIuNCwwLTQtMC44LTUuNy0yLjRMNjIsMTA1LjdjLTMuMi0zLjItMy4yLTguMSwwLTExLjNjMy4yLTMuMiw4LjEtMy4yLDExLjMsMGwxOC42LDE4LjYKCWw0Mi45LTQyLjljMy4yLTMuMiw4LjEtMy4yLDExLjMsMEMxNDkuNCw3My4zLDE0OS40LDc4LjIsMTQ2LjEsODEuNEwxNDYuMSw4MS40eiIvPgo8L3N2Zz4K"
                        alt="成功"
                        width={32}
                        height={32}/>
                  </div>
                  <span>人机验证已通过</span>
                </div>
              </div>
                    </div> 

                <Popover
                
        id={id}
        open={this.state.popoverVisible}
        anchorEl={this.state.anchorEl}
        onClose={() => this.setState({
          anchorEl: null, 
          popoverVisible: false
        })
      
        }
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
              
              // onOpenChange={(event, data) => {
              //   this.setState({popoverVisible: data.open})
              //   if (data.open) {
              //     this.props.refresh && this.props.refresh()
              //   }
              // }} 
                >
                <GoCaptcha
                    value={popoverVisible}
                    width="300px"
                    height="240px"
                    maxDot={5}
                    calcPosType="screen"
                    imageBase64={imageBase64}
                    thumbBase64={thumbBase64}
                    close={this.handleCloseEvent}
                    refresh={this.handleRefreshEvent}
                    confirm={this.handleConfirmEvent}
                />
                </Popover> 
          </div>
        </div>
  }

  static getDerivedStateFromProps (nextProps: CaptchaButtonProps, prevState: CaptchaButtonState) {
    const res = {} as CaptchaButtonState
    let count = 0

    if (prevState.popoverVisible) {
      res.captStatus = 'check'
      count++
      // if (prevState.captStatus !== 'check') {
      // nextProps.refresh && nextProps.refresh()
      // }
    } else if (prevState.captStatus === 'check') {
      res.captStatus = nextProps.value
      count++
    }

    if (!prevState.popoverVisible) {
      res.imageBase64 = ''
      res.thumbBase64 = ''
    } else {
      res.imageBase64 = nextProps.imageBase64
      res.thumbBase64 = nextProps.thumbBase64
    }

    if (nextProps.value !== prevState.captStatus) {
      if (prevState.captStatus !== 'check') {
        res.captStatus = nextProps.value
        count++
      }

      // ============================
      // 为了解决状态冲突加一个 overing
      // ============================
      if (nextProps.value === 'overing') {
        res.popoverVisible = false
        res.captStatus = 'over'
        count++
        //if (nextProps.value !== 'over') {
        nextProps.changeValue && nextProps.changeValue('over')
        //}
      } else if (nextProps.value === 'success') {
        res.popoverVisible = false
        res.captStatus = 'success'
        count++
      }
    }

    return (count ? res : null)
  }

  handleRefreshEvent = () => {
    this.setState({
      captStatus: 'check'
    })
    this.props.refresh && this.props.refresh()
  }

  handleConfirmEvent = (data: {x: number, y: number}[]) => {
    this.props.confirm && this.props.confirm(data)
  }

  handleCloseEvent = () => {
    this.setState({
      popoverVisible: false
    })
  }
}