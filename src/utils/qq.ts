export const QQ_NUMBER = '2944103698';
export const QQ_SHARE_URL = 'https://qm.qq.com/q/fpHmRvIqFW';
export const QQ_QR_URL = 'https://qm.qq.com/cgi-bin/qm/qr?k=muLDpgB9QcB4BXP0pSavYScUVjwWq5Lx';
const params = '&jump_from=&auth=&app_name=&authSig=&source_id=';
export const QQ_ANDROID_URL = 'mqqopensdkapi://bizAgent/qm/qr?url=' + encodeURIComponent(QQ_QR_URL + params + '3_40001');
const iosParams = encodeURIComponent(QQ_QR_URL.replace('https:', 'http:') + params + '2_40001');
export const QQ_IOS_URL = 'mqqopensdkapi://bizAgent/qm/qr?url=' + iosParams;
export const QQ_IOS_WECHAT_URL = 'https://h5.qun.qq.com/h5/jump-page/index.html?sid=1&isQim=false&url=' + iosParams;
export const QQ_DESKTOP_URL = 'tencent://ntqq-open?subCmd=profile&action=openMiniBuddyProfile&actionParams=' + encodeURIComponent(JSON.stringify({ uin: QQ_NUMBER, sourceType: 'QrCodeShareBuddyLink' }));

export function getQQEnvironment(ua: string, platform = '', maxTouchPoints = 0) {
  // Preserve the official priority: Android, iOS (including iPadOS), Windows Phone, desktop.
  const os = /Android/i.test(ua) ? 'android'
    : /iPhone|iPad|iPod/i.test(ua) || (/MacIntel/.test(platform) && maxTouchPoints > 2) ? 'ios'
    : /Windows Phone|WPDesktop/i.test(ua) ? 'winphone' : 'desktop';
  const version = ua.match(/MicroMessenger\/([\d.]+)/i)?.[1];
  const parts = (version ?? '').split('.').map(Number);
  const versionNumber = (parts[0] ?? 0) * 1000000 + (parts[1] ?? 0) * 1000 + (parts[2] ?? 0);
  const wechat = Boolean(version && versionNumber >= 6005006 && !/\bwxwork\//i.test(ua));
  const launchUrl = os === 'desktop' ? QQ_DESKTOP_URL
    : os === 'ios' ? (wechat ? QQ_IOS_WECHAT_URL : QQ_IOS_URL) : QQ_ANDROID_URL;
  const downloadUrl = os === 'ios' ? 'itms-apps://itunes.apple.com/cn/app/qq-2011/id444934666?mt=8'
    : os === 'winphone' ? 'https://www.windowsphone.com/zh-cn/store/app/qq/b45f0a5f-13d8-422b-9be5-c750af531762'
    : 'https://im.qq.com';
  return { os, wechat, launchUrl, downloadUrl, useBridge: os === 'android' && wechat };
}
