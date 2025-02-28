// Ansichts-Auswahl: Aktualisieren der Tabellenüberschrift
$(document).ready(function() {
  // Aktualisiert die Ansicht, passt Button-Klassen, Überschrift und Tabellenstruktur an
  function updateView(view, $clickedButton) {
    // Button-Klassen anpassen: Alle zurück auf btn-primary, der geklickte Button auf btn-secondary
    $("#weeklyBtn, #monthlyBtn").removeClass("btn-secondary").addClass("btn-primary");
    $clickedButton.removeClass("btn-primary").addClass("btn-secondary");

    // Überschrift anpassen
    var headerText = "";
    var today = new Date();
    if (view === "weekly") {
      var currentDay = today.getDay() || 7; // Sonntag als 7
      var monday = new Date(today);
      monday.setDate(today.getDate() - currentDay + 1);
      var sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      headerText = "Wochenansicht - " + monday.toLocaleDateString() + " bis " + sunday.toLocaleDateString();
    } else if (view === "monthly") {
      var month = today.toLocaleString('default', { month: 'long' });
      var year = today.getFullYear();
      headerText = "Monatsansicht - " + month + " " + year;
    }
    $(".h2").text(headerText);

    // Tabelle mit Dummy-Daten füllen und Tabellenstruktur anpassen
    fillTableWithDummyData(view);
  }

  // Standardmäßig die Tagesansicht aktivieren
  updateView("weekly", $("#wekklyBtn"));

  // Klick-Events für die Ansichts-Schaltflächen
  $("#weeklyBtn").click(function() {
    updateView("weekly", $(this));
  });
  $("#monthlyBtn").click(function() {
    updateView("monthly", $(this));
  });

  $("#printBtn").click(function() {
    // Kombinieren der Überschrift und der Tabelle
    var printContents = "";
    $(".header-container, table").each(function() {
      printContents += this.outerHTML;
    });
    
    // Erstelle ein neues Fenster
    var printWindow = window.open('', '', 'height=600,width=800');
    
    // Schreibe den HTML-Inhalt inklusive CSS in das neue Fenster
    printWindow.document.write('<html><head><title>Druckansicht</title>');
    printWindow.document.write('<link rel="stylesheet" href="./css/bootstrap.min.css">');
    printWindow.document.write('<style>');
    printWindow.document.write('@media print {');
    printWindow.document.write('  table { border-collapse: collapse; }');
    printWindow.document.write('  table, th, td { border: 1px solid #000 !important; }');
    printWindow.document.write('}');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    
    // Druckdialog öffnen
    printWindow.print();
    
    // Fenster schließen, wenn der Druckdialog beendet ist
    printWindow.close();
  });
  
  
  
});

  // Füllt die Tabelle (#tableBody) mit Dummy-Daten und passt den Tabellenkopf an
  function fillTableWithDummyData(view) {
    // Dummy-Daten mit Tag-Werten
    const dummyData = [
      { kostenstelle: "310", akkordMin: 0.5, gebrMin: 0.45, durchMin: 0.33, gesamtstunden: 8, perc10: 0.8, perc25: 1.6, perc40: 3.2 },
      { kostenstelle: "305", akkordMin: 0.6, gebrMin: 0.55, durchMin: 0.5, gesamtstunden: 7.5, perc10: 0.75, perc25: 1.5, perc40: 3.0 },
      { kostenstelle: "420", akkordMin: 0.8, gebrMin: 0.75, durchMin: 0.66, gesamtstunden: 8.5, perc10: 0.85, perc25: 1.7, perc40: 3.4 }
    ];

    // Tabellenkopf anpassen: Bei weekly oder monthly die Spalte "Tag" einfügen
    
      headerHtml = `
        <tr>
          <th scope="col">Kostenstelle</th>
          <th scope="col">Lohnart</th>
          <th scope="col">Akkord Min.</th>
          <th scope="col">gebr. Min.</th>
          <th scope="col">durch. Min.</th>
          <th scope="col">Gesamtstunden</th>
          <th scope="col">10%</th>
          <th scope="col">25%</th>
          <th scope="col">40%</th>
        </tr>
      `;
    $("table thead").html(headerHtml);

    // Tabelle leeren und Dummy-Daten einfügen
    const $tableBody = $("#tableBody");
    $tableBody.empty();
    
    dummyData.forEach(function(row) {
      let rowHtml = "";      
        rowHtml = `
          <tr>
            <td>${row.kostenstelle}</td>
            <td contenteditable="true"></td>
            <td>${row.akkordMin}</td>
            <td>${row.gebrMin}</td>
            <td>${row.durchMin}</td>
            <td>${row.gesamtstunden}</td>
            <td>${row.perc10}</td>
            <td>${row.perc25}</td>
            <td>${row.perc40}</td>
          </tr>
        `;
      $tableBody.append(rowHtml);
    });
  }

  // Dropdown-Funktionalität (übernommen aus der Eingabemaske)
  
  // Initialisiert ein einzelnes Dropdown-Element
  function initDropdown(dropdown) {
    if (dropdown.dataset.dropdownInited === "true") return;
    dropdown.dataset.dropdownInited = "true";
  
    const searchInput = dropdown.querySelector('input[type="search"]');
    const list = dropdown.querySelector('ul');
  
    searchInput.addEventListener('focus', function() {
      // Auswahl bleibt erhalten, kein Reset nötig
    });
  
    searchInput.addEventListener('input', function() {
      searchInput.dataset.selected = "";
      const filter = this.value.trim().toLowerCase();
      if (filter === '') {
        list.style.display = 'none';
      } else {
        list.style.display = 'block';
        list.querySelectorAll('li').forEach(function(item) {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(filter) ? '' : 'none';
        });
      }
    });
  
    searchInput.addEventListener('blur', function() {
      // Timeout, damit Klicks auf Dropdown-Items verarbeitet werden
      setTimeout(function() {
        if (searchInput.dataset.selected !== "true") {
          searchInput.value = "";
        }
      }, 200);
    });
  
    list.addEventListener('click', function(e) {
      const item = e.target.closest('.dropdown-item');
      if (item) {
        e.preventDefault();
        searchInput.value = item.textContent.trim();
        searchInput.dataset.selected = "true";
        list.style.display = 'none';
      }
    });
  }
  
  // Initialisiert alle Dropdowns in einem Container
  function initDropdowns(container) {
    container.querySelectorAll('.dropdown-menu').forEach(function(dropdown) {
      initDropdown(dropdown);
    });
  }
  
  // Globaler Listener: Schließt offene Dropdowns, wenn außerhalb geklickt wird
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.dropdown-menu').forEach(function(dropdown) {
      if (!dropdown.contains(e.target)) {
        const list = dropdown.querySelector('ul');
        if (list) {
          list.style.display = 'none';
        }
      }
    });
  });
  
  // Initial beim Laden der Seite alle existierenden Dropdowns initialisieren
  document.addEventListener('DOMContentLoaded', function() {
    initDropdowns(document);
  });
  