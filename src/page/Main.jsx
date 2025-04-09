import React from 'react'
import MainRenderer from '../components/main/MainRenderer.jsx';
import MetatagRenderer from '../components/MetatagRenderer.jsx';
function Main() {
    return <div>
        <MetatagRenderer />
        <MainRenderer />
    </div>
}

export default Main;