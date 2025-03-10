import AppRoutes from "./routes/AppRoutes"
import { Provider } from "react-redux"
import {store ,presistor} from "./redux/store/store"
import { PersistGate } from "redux-persist/es/integration/react"
const App = () => {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={presistor}>
    <AppRoutes/>
    </PersistGate>
   
    </Provider>
    
  )
}

export default App