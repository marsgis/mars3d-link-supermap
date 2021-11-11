export function getRootUrl() {
  const path = "/apps";
  let url = "";
  if (window.location.href.indexOf(path) !== -1) {
    url = window.location.href.substring(
      0,
      window.location.href.indexOf(path) + 1
    );
  }
  if (!url) {
    if (location.href.indexOf("/iportal/") !== -1) {
      url = `${location.protocol}//${location.host}/iportal/`;
    } else {
      url = `${location.protocol}//${location.host}/`;
    }
  }
  //模拟本机portal开发
  // url = "http://localhost:8190/iportal/"
  return url;
}

export function isIportalProxyServiceUrl(serviceUrl, serviceProxy) {
  if (serviceProxy && serviceProxy.enable) {
    let proxyStr = '';
    if (serviceProxy.proxyServerRootUrl) {
      proxyStr = `${serviceProxy.proxyServerRootUrl}/`;
    } else if (serviceProxy.rootUrlPostfix) {
      proxyStr = `${serviceProxy.port}/${serviceProxy.rootUrlPostfix}/`;
    } else if (!serviceProxy.rootUrlPostfix) {
      proxyStr = `${serviceProxy.port}/`;
    }
    if (serviceProxy.port !== 80) {
      return serviceUrl.indexOf(proxyStr) >= 0;
    } else {
      //代理端口为80,url中不一定有端口,满足一种情况即可
      return serviceUrl.indexOf(proxyStr) >= 0 || serviceUrl.indexOf(proxyStr.replace(
        ':80', '')) >= 0;
    }
  } else {
    return false;
  }
}

//获取ip或者域名
export function getHostName(serviceUrl) {
  // ''http://localhost:8195/portalproxy/iserver/services/3D-ifc/rest/realspace''
  // http://localhost/portalproxy/iserver/services/3D-ifc/rest/realspace'
  let array = serviceUrl.split('://');
  let index = array[1].indexOf(':');
  let ip = '';
  if (index < 0) {
    let array2 = array[1].split('/');
    ip = array2[0];
  } else {
    let array3 = array[1].split(':');
    ip = array3[0];
  }
  return ip;
}