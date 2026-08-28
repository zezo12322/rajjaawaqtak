import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastProvider } from "./components/ui/Toast"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import Awareness from "./pages/Awareness"
import Advices from "./pages/Advices"
import GamesPage from "./pages/GamesPage"
import VolunteerPage from "./pages/VolunteerPage"
import ContactPage from "./pages/ContactPage"

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/advices" element={<Advices />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
