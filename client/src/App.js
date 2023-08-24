import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Homepage from "scenes/homepage";
import LoginPage from "scenes/loginpage";
import Profilepage from "scenes/profilepage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  console.log(isAuth);
  return (
    <div className='App'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/' element={<LoginPage />} />
            {/* <Route path='/home' element={<Homepage />} /> */}
            <Route
              path='/home'
              element={
                isAuth ? (
                  <>
                    {console.log("wow", isAuth)}
                    <Homepage />
                  </>
                ) : (
                  <>
                    {console.log("wow", isAuth)}
                    <Navigate to='/' />
                  </>
                )
              }
            />
            <Route
              path='/profile/:userId'
              element={isAuth ? <Profilepage /> : <Navigate to='/' />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
