import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './page/Main'
import PlayerInfo from './page/PlayerInfo'
import InputScore from './page/InputScore'
import TournamentResult from './page/TournamentResult'
import Privacy from './components/main/Privacy'
import HowToUse from './components/main/HowToUse'
import ReactGA4 from 'react-ga4'
import { useEffect } from 'react'


export const base_url = import.meta.env.VITE_BASE_URL;
function App() {
  useEffect(() => {
    ReactGA4.initialize(
      [
        {
          trackingId: 'G-BVKP7NB8Z6',
          gaOptions: {
            siteSpeedSampleRate: 100
          }
        }
      ]
    )
  }, [])

  return (
    <BrowserRouter> 
    <Routes>
      <Route path ='/' element={<Main />}/>
      <Route path='/:tournamentId' element={<PlayerInfo />}/>
      <Route path='/:tournamentId/match' element={<InputScore />}/>
      <Route path='/:tournamentId/match/result' element={<TournamentResult />}/>
      <Route path="/privacy" element= {<Privacy />} />
      <Route path="/how-to-use" element= {<HowToUse />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App

// 그룹 개수 입력
// 각 그룹당 사람 수 입력

// 사람 이름 입력 /:tournamentId

// 점수 입력 -> url 접근 /:tournamentId/match
// 계산 결과 -> url 접근 /:tournamentId/match/result


// 처음 입력 버튼
// 두번째 입력 버튼
// 이름 입력
// 
// Link Button