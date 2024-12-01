import { writable, type Writable } from 'svelte/store';

export const tabs: Writable<Array<{id: number, title:string, component: any, props: any}>> = writable([]);
export const activeTab: Writable<number | null> = writable(null);

export function addTab(title: string, component: any, props: any) {
  tabs.update((current) => {
    const newTabId = current.length ? Math.max(...current.map(tab => tab.id)) + 1 : 1;
    activeTab.set(newTabId);
    return [...current, { id: newTabId, title, component, props }];
  });
}

export function removeTab(id: number) {
  tabs.update(current => current.filter(tab => tab.id !== id));
  activeTab.update(current => (current === id ? null : current));
}

export function setActiveTab(id: number) {
  activeTab.set(id);
}