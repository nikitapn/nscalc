import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})




import { tabs, activeTab, addTab, removeTab, setActiveTab } from './lib/TabStore';
import TabContentA from './lib/TabContentA.svelte';
import TabContentB from './lib/TabContentB.svelte';


(window as any).add = () => {
  addTab("xxx", TabContentB, {data: "www"})
}


export default app
