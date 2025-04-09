import React from 'react'
import { Helmet } from 'react-helmet-async'
import {base_url} from '../App'

function MetatagRenderer() {
  return  (
    <>
    <Helmet>
    <title>KDK 테니스 매치</title>
    <meta name="description" content="KDK 방식으로 테니스 경기를 관리하는 웹사이트입니다." />
    <meta name="keywords" content="테니스, 경기관리, KDK, 매치, 테니스폴리오, tennisfolio" />
    <meta property="og:title" content="KDK 테니스 매치" />
    <meta property="og:description" content="KDK 방식 테니스 경기 매니저" />
    <meta property="og:image" content="/images/Table.png" />
    <meta property="og:url" content="https://tennisfolio.net/" />
  </Helmet>
  </>
  )
}

export default MetatagRenderer