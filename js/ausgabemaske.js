// Ansichts-Auswahl: Aktualisieren der Tabellenüberschrift
$(document).ready(function() {
  // Aktualisiert die Ansicht, passt Button-Klassen, Überschrift und Tabellenstruktur an
  function updateView(view, $clickedButton) {
    // Button-Klassen anpassen: Alle zurück auf btn-primary, der geklickte Button auf btn-secondary
    $("#dailyBtn, #weeklyBtn, #monthlyBtn").removeClass("btn-secondary").addClass("btn-primary");
    $clickedButton.removeClass("btn-primary").addClass("btn-secondary");

    // Überschrift anpassen
    var headerText = "";
    var today = new Date();
    if (view === "daily") {
      headerText = "Tagesansicht - " + today.toLocaleDateString();
    } else if (view === "weekly") {
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

  // Füllt die Tabelle (#tableBody) mit Dummy-Daten und passt den Tabellenkopf an
  function fillTableWithDummyData(view) {
    // Dummy-Daten mit Tag-Werten
    const dummyData = [
      { tag: "24.02.2025", kostenstelle: "310", akkordMin: 30, gebrMin: 25, durchMin: 20, gesamtstunden: 8, perc10: 0.8, perc20: 1.6, perc40: 3.2 },
      { tag: "24.02.2025", kostenstelle: "305", akkordMin: 40, gebrMin: 35, durchMin: 30, gesamtstunden: 7.5, perc10: 0.75, perc20: 1.5, perc40: 3.0 },
      { tag: "25.02.2025", kostenstelle: "420", akkordMin: 50, gebrMin: 45, durchMin: 40, gesamtstunden: 8.5, perc10: 0.85, perc20: 1.7, perc40: 3.4 }
    ];

    // Tabellenkopf anpassen: Bei weekly oder monthly die Spalte "Tag" einfügen
    let headerHtml = "";
    if (view === "daily") {
      headerHtml = `
        <tr>
          <th scope="col">Kostenstelle</th>
          <th scope="col">Akkord Min.</th>
          <th scope="col">gebr. Min.</th>
          <th scope="col">durch. Min.</th>
          <th scope="col">Gesamtstunden</th>
          <th scope="col">10%</th>
          <th scope="col">20%</th>
          <th scope="col">40%</th>
        </tr>
      `;
    } else {
      headerHtml = `
        <tr>
          <th scope="col">Tag</th>
          <th scope="col">Kostenstelle</th>
          <th scope="col">Akkord Min.</th>
          <th scope="col">gebr. Min.</th>
          <th scope="col">durch. Min.</th>
          <th scope="col">Gesamtstunden</th>
          <th scope="col">10%</th>
          <th scope="col">20%</th>
          <th scope="col">40%</th>
        </tr>
      `;
    }
    $("table thead").html(headerHtml);

    // Tabelle leeren und Dummy-Daten einfügen
    const $tableBody = $("#tableBody");
    $tableBody.empty();
    
    dummyData.forEach(function(row) {
      let rowHtml = "";
      if (view === "daily") {
        rowHtml = `
          <tr>
            <td>${row.kostenstelle}</td>
            <td>${row.akkordMin}</td>
            <td>${row.gebrMin}</td>
            <td>${row.durchMin}</td>
            <td>${row.gesamtstunden}</td>
            <td>${row.perc10}</td>
            <td>${row.perc20}</td>
            <td>${row.perc40}</td>
          </tr>
        `;
      } else {
        rowHtml = `
          <tr>
            <td>${row.tag}</td>
            <td>${row.kostenstelle}</td>
            <td>${row.akkordMin}</td>
            <td>${row.gebrMin}</td>
            <td>${row.durchMin}</td>
            <td>${row.gesamtstunden}</td>
            <td>${row.perc10}</td>
            <td>${row.perc20}</td>
            <td>${row.perc40}</td>
          </tr>
        `;
      }
      $tableBody.append(rowHtml);
    });
  }

  // Standardmäßig die Tagesansicht aktivieren
  updateView("daily", $("#dailyBtn"));

  // Klick-Events für die Ansichts-Schaltflächen
  $("#dailyBtn").click(function() {
    updateView("daily", $(this));
  });
  $("#weeklyBtn").click(function() {
    updateView("weekly", $(this));
  });
  $("#monthlyBtn").click(function() {
    updateView("monthly", $(this));
  });
});


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
  