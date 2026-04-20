(function () {
  var messageOrder = [".m1", ".m2", ".m3", ".m4", ".m5", ".m6"];
  var messageStartOffsets = [0, 15000, 25000, 45000, 60000, 80000];
  var popupSoundUrl = "http://easyhotdate.com/chat/df5/f4t/gr7/images5/alert.mp3";
  var typingIndicator = document.getElementById("typingIndicator");
  var messagesContainer = document.getElementById("messages");
  var popupAudio = null;

  function currentTime() {
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, "0");
    var mm = String(now.getMinutes()).padStart(2, "0");
    return hh + ":" + mm;
  }

  function setTimestamp(id) {
    var node = document.getElementById(id);
    if (node) node.textContent = currentTime();
  }

  function toggleTyping(isTyping) {
    if (!typingIndicator) return;
    typingIndicator.classList.toggle("typing-on", isTyping);
  }

  function revealMessage(selector, timeId) {
    var node = document.querySelector(selector);
    if (!node) return;
    node.classList.add("reveal");
    setTimestamp(timeId);
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth"
      });
    }
  }

  function startSequence() {
    messageOrder.forEach(function (selector, index) {
      var startsAt = messageStartOffsets[index] || 0;
      var timeId = "t" + (index + 1);

      setTimeout(function () {
        toggleTyping(true);
      }, startsAt);

      setTimeout(function () {
        revealMessage(selector, timeId);
      }, startsAt + 850);

      setTimeout(function () {
        toggleTyping(false);
      }, startsAt + 1700);
    });
  }

  function setupModal() {
    var clickableArea = document.querySelector(".chat-card");
    var contactBtn = document.getElementById("contactBtn");
    var modal = document.getElementById("modalOverlay");

    if (!clickableArea || !contactBtn || !modal) return;

    clickableArea.addEventListener("click", function () {
      playPopupSound();
      modal.hidden = false;
    });

    contactBtn.addEventListener("click", function () {
      modal.hidden = true;
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.hidden = true;
      }
    });
  }

  function setupTermsModal() {
    var openTermsBtn = document.getElementById("openTerms");
    var closeTermsBtn = document.getElementById("closeTerms");
    var termsOverlay = document.getElementById("termsOverlay");

    if (!openTermsBtn || !closeTermsBtn || !termsOverlay) return;

    openTermsBtn.addEventListener("click", function () {
      termsOverlay.hidden = false;
    });

    closeTermsBtn.addEventListener("click", function () {
      termsOverlay.hidden = true;
    });

    termsOverlay.addEventListener("click", function (event) {
      if (event.target === termsOverlay) {
        termsOverlay.hidden = true;
      }
    });
  }

  function formatTermsContent() {
    var raw = document.getElementById("termsRaw");
    var content = document.getElementById("termsContent");
    if (!raw || !content) return;

    var lines = raw.textContent.split("\n").map(function (line) {
      return line.trim();
    });
    var currentList = null;
    var currentListType = "";

    function closeList() {
      currentList = null;
      currentListType = "";
    }

    function createParagraph(text) {
      var paragraph = document.createElement("p");
      var clauseMatch = text.match(/^(\d+[a-z]?\.)\s+(.*)$/i);

      if (clauseMatch) {
        var number = document.createElement("span");
        number.className = "clause-number";
        number.textContent = clauseMatch[1];
        paragraph.appendChild(number);
        paragraph.appendChild(document.createTextNode(clauseMatch[2]));
      } else {
        paragraph.textContent = text;
      }

      if (/^Effective as of /i.test(text)) {
        paragraph.classList.add("effective-date");
      }

      return paragraph;
    }

    function createServiceInfoTable(entries) {
      var table = document.createElement("table");
      table.className = "terms-table";

      var thead = document.createElement("thead");
      var headerRow = document.createElement("tr");
      var itemHeader = document.createElement("th");
      var detailsHeader = document.createElement("th");
      itemHeader.textContent = "Item";
      detailsHeader.textContent = "Details";
      headerRow.appendChild(itemHeader);
      headerRow.appendChild(detailsHeader);
      thead.appendChild(headerRow);
      table.appendChild(thead);

      var tbody = document.createElement("tbody");
      for (var idx = 0; idx < entries.length; idx += 2) {
        if (!entries[idx + 1]) break;
        var row = document.createElement("tr");
        var keyCell = document.createElement("td");
        var valueCell = document.createElement("td");
        keyCell.textContent = entries[idx];
        valueCell.textContent = entries[idx + 1];
        row.appendChild(keyCell);
        row.appendChild(valueCell);
        tbody.appendChild(row);
      }

      table.appendChild(tbody);
      return table;
    }

    for (var i = 0; i < lines.length; i += 1) {
      var line = lines[i];

      if (!line || line === "⸻") {
        closeList();
        continue;
      }

      if (/^[IVXLCDM]+\.\s+[A-Z]/.test(line)) {
        closeList();
        var heading = document.createElement("h3");
        heading.textContent = line;
        content.appendChild(heading);
        continue;
      }

      if (/^34\.\s+Service Information Table/i.test(line)) {
        closeList();
        content.appendChild(createParagraph(line));

        var tableEntries = [];
        i += 1;

        while (i < lines.length) {
          var tableLine = lines[i];
          if (!tableLine || tableLine === "⸻") {
            i += 1;
            continue;
          }
          if (/^[IVXLCDM]+\.\s+[A-Z]/.test(tableLine) || /^\d+[a-z]?\.\s+/.test(tableLine)) {
            i -= 1;
            break;
          }
          if (!/^(Item|Details)$/i.test(tableLine)) {
            tableEntries.push(tableLine);
          }
          i += 1;
        }

        if (tableEntries.length >= 2) {
          content.appendChild(createServiceInfoTable(tableEntries));
        }
        continue;
      }

      if (/^[a-z]\)\s+/i.test(line) || /^\*\s+/.test(line)) {
        var listType = /^[a-z]\)\s+/i.test(line) ? "alpha" : "bullet";
        if (!currentList || currentListType !== listType) {
          closeList();
          currentList = document.createElement("ul");
          currentListType = listType;
          content.appendChild(currentList);
        }
        var listItem = document.createElement("li");
        listItem.textContent = line.replace(/^[a-z]\)\s+/i, "").replace(/^\*\s+/, "");
        currentList.appendChild(listItem);
        continue;
      }

      closeList();
      content.appendChild(createParagraph(line));
    }
  }

  function injectTodayDate() {
    var today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node = walker.nextNode();

    while (node) {
      if (node.nodeValue && node.nodeValue.indexOf("[INSERT DATE]") !== -1) {
        node.nodeValue = node.nodeValue.replace("[INSERT DATE]", today);
      }
      node = walker.nextNode();
    }
  }

  function playPopupSound() {
    if (!popupAudio) {
      popupAudio = new Audio(popupSoundUrl);
      popupAudio.preload = "auto";
    }

    popupAudio.currentTime = 0;
    popupAudio.play().catch(function () {
      /* Ignore playback failures in restricted environments. */
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectTodayDate();
    formatTermsContent();
    startSequence();
    setupModal();
    setupTermsModal();
  });
})();