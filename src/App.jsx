import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import PollDetail from "./pages/PollDetail"
import MyPolls from "./pages/MyPolls"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poll/:pollId" element={<PollDetail />} />
        <Route path="/my-polls" element={<MyPolls />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
