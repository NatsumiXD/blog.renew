import { QQ_NUMBER, getQQEnvironment } from './qq';
  type Bridge = { invoke: (method: string, args: { schemeUrl: string }, callback: (result?: { err_msg?: string }) => void) => void };
  class QQContact extends HTMLElement {
    private controller?: AbortController;
    private timer?: ReturnType<typeof setTimeout>;
    connectedCallback() {
      this.controller = new AbortController();
      const { signal } = this.controller;
      const environment = getQQEnvironment(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);
      const status = this.querySelector<HTMLElement>('[data-status]')!;
      const download = this.querySelector<HTMLAnchorElement>('[data-download]')!;
      download.href = environment.downloadUrl;
      const showStatus = (text: string) => { status.textContent = text; };
      const clearTimer = () => { clearTimeout(this.timer); };
      document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimer(); }, { signal });
      window.addEventListener('pagehide', clearTimer, { signal });
      this.querySelector('[data-copy]')!.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(QQ_NUMBER); showStatus('QQ 号码已复制，打开 QQ 搜索添加即可。'); }
        catch { showStatus(`未能自动复制，请手动复制 QQ 号码：${QQ_NUMBER}`); }
      }, { signal });
      this.querySelector('[data-open]')!.addEventListener('click', () => {
        clearTimer();
        showStatus('正在尝试打开 QQ，请允许浏览器打开应用。');
        this.timer = setTimeout(() => { if (!document.hidden) showStatus('若 QQ 尚未打开，可使用官方跳转、升级 QQ，或复制号码搜索添加。'); }, 2500);
        const bridge = (window as Window & { WeixinJSBridge?: Bridge }).WeixinJSBridge;
        if (environment.useBridge && bridge) {
          try {
            bridge.invoke('launchApplication', { schemeUrl: environment.launchUrl }, result => {
              if (!this.isConnected) return;
              if (result?.err_msg === 'launchApplication:fail') {
                clearTimer();
                window.location.href = environment.downloadUrl;
              }
            });
          } catch { showStatus('微信未能打开 QQ，请使用官方跳转或在浏览器中打开。'); }
        } else if (environment.useBridge) {
          clearTimer();
          showStatus('请使用“腾讯官方跳转”在微信中打开 QQ，或选择在浏览器中打开。');
        } else {
          window.location.href = environment.launchUrl;
        }
      }, { signal });
    }
    disconnectedCallback() { this.controller?.abort(); clearTimeout(this.timer); }
  }
  if (!customElements.get('qq-contact')) customElements.define('qq-contact', QQContact);