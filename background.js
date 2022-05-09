"use strict";

browser.runtime.onStartup.addListener(() => {
  browser.windows.getAll({windowTypes: ["normal"]})
  .then((windowInfoArray) => {
    windowInfoArray.forEach(windowInfo => {
      Promise.allSettled([
        browser.tabs.query({
          windowId: windowInfo.id,
          title: "New Tab"
        }),
        browser.tabs.query({
          windowId: windowInfo.id,
          active: true
        })
        .then(tabArrayActive => tabArrayActive[0])
      ])
      .then(results => {
        if (results[0].status === "fulfilled") {
          let tabArrayNew = results[0].value;
          if (tabArrayNew.length > 0) {
            let newTab = tabArrayNew[tabArrayNew.length - 1]
            browser.tabs.highlight({
              windowId: newTab.windowId,
              tabs: newTab.index
            });
          } else {
            browser.tabs.create({
              windowId: windowInfo.id
            });
          }
        } else {
          throw new Error("Unable to query tabs.")
        }
        return results[1];
      })
      .then(result => {
        if (result.status === "fulfilled") {
          let activeTab = result.value;
          if (activeTab.title !== "New Tab") {
            browser.tabs.discard(activeTab.id);
          }
        }
      });
    });
  });
});
