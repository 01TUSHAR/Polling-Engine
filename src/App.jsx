import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import PollDetail from "./pages/PollDetail"
import MyPolls from "./pages/MyPolls"


function App() {
  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poll/:pollId" element={<PollDetail />} />
        <Route path="/my-polls" element={<MyPolls />} />
      </Routes>
    
  )
}

export default App
