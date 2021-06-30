function addContentToPage() {
    const p = document.createElement('p');
    p.innerText = "This text was just added";
    document.body.appendChild(p);
}

function alterPageContent() {
    const el = document.querySelector('p');
    el.innerText += ".";
}

/**
 *
 *
 * @param {sequence<MutationRecord>} mutations
 * @param {MutationObserver} observer
 */
function mutationCallback(mutations, observer) {
    for (let mut of mutations) {
        console.log(mut);
    }

    console.log(observer);
}



/**
 interface MutationObserver {
  constructor(MutationCallback callback);
  undefined observe(Node target, optional MutationObserverInit options = {});
  undefined disconnect();
  sequence<MutationRecord> takeRecords();
};
 callback MutationCallback = undefined (sequence<MutationRecord> mutations, MutationObserver observer);
 dictionary MutationObserverInit {
  boolean childList = false;
  boolean attributes;
  boolean characterData;
  boolean subtree = false;
  boolean attributeOldValue;
  boolean characterDataOldValue;
  sequence<DOMString> attributeFilter;
};
 */

/** {@type MutationObserverInit} */
const options = {
    childList: true,
    attributes: false,
    characterData: true,
    subtree: false,
    attributeOldValue: false,
    characterDataOldValue: false,
    //attributeFilter: null // sequence<DOMString>
};

mutationObserver = new MutationObserver(mutationCallback);
mutationObserver.observe(document.body, options);