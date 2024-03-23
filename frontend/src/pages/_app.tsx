import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from 'react-redux';
import { store } from "@/providers/store";
import Alert from '@/components/alert/alert'
import SideBar from "@/components/sidebar/sidebar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Alert />
      <div className="custom-body">
      <SideBar/>
      <div className="content">
      <Component {...pageProps} />
      </div>
      </div>
    </Provider>)
    ;
}
