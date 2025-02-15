$(document).ready(function() {
    // Nebenzeiten-Plus-Button: Fügt innerhalb eines inneren Abschnitts eine weitere Nebenzeitenszeile hinzu.
    $(document).on('click', '.add-nebenzeiten', function() {
      var $group = $(this).closest('.nebenzeiten-group');
      var $newRow = $group.find('.nebenzeiten-row').first().clone();
      $newRow.find('input').val('');
      $newRow.find('select').prop('selectedIndex', 0);
  
      $(this).parent().before($newRow);
  
      // Entferne das Attribut, damit das neue Dropdown neu initialisiert wird
      $newRow.find('.dropdown-menu').removeAttr('data-dropdown-inited');
  
      // Dropdowns im neuen Nebenzeiten-Block initialisieren
      initDropdowns($newRow.get(0));
    });
  
    // Neuer Abschnitt innerhalb eines Mitarbeiters:
    $(document).on('click', '.add-inner-section', function() {
      var $innerContainer = $(this).closest('.inner-container');
      var $wrapper = $innerContainer.find('.inner-section-wrapper');
      var $btn = $(this).detach();
  
      // Klonen des letzten vorhandenen Abschnitts
      var $newSection = $wrapper.children('.eingabemaske-abschnitt').last().clone();
      $newSection.find('input').val('');
      $newSection.find('select').prop('selectedIndex', 0);
  
      // Neuen Abschnitt anhängen und den Button unter diesen einfügen
      $wrapper.append($newSection);
      $newSection.after($btn);
  
      // Entferne das Attribut für alle Dropdowns im neuen Abschnitt
      $newSection.find('.dropdown-menu').removeAttr('data-dropdown-inited');
  
      // Dropdowns im neuen Abschnitt initialisieren
      initDropdowns($newSection.get(0));
    });
  
    // Neuer Mitarbeiter:
    $(document).on('click', '.add-eingabemaske', function() {
      var $employeeBtn = $(this).detach();
      var $newRow = $('#eingabemaske-container .eingabemaske-row').first().clone();
      $newRow.find('input').val('');
      $newRow.find('select').prop('selectedIndex', 0);
  
      // In jedem inner-container: Nur den ersten inneren Abschnitt beibehalten
      $newRow.find('.inner-container').each(function() {
        var $wrapper = $(this).find('.inner-section-wrapper');
        $wrapper.children('.eingabemaske-abschnitt').not(':first').remove();
      });
  
      $('#eingabemaske-container').append($newRow);
      $newRow.after($employeeBtn);
  
      // Entferne das Attribut für alle Dropdowns im neuen Mitarbeiter-Block
      $newRow.find('.dropdown-menu').removeAttr('data-dropdown-inited');
  
      // Dropdowns im neuen Mitarbeiter-Block initialisieren
      initDropdowns($newRow.get(0));
    });
  });

  // Plus-Knopf für Gewichtsklasse, Stückzahl & VGZ:
$(document).on('click', '.add-gewichtsklasse', function() {
  var $group = $(this).closest('.gewichtsklasse-group');
  // Klonen der ersten Zeile der Gruppe
  var $newRow = $group.find('.gewichtsklasse-row').first().clone();
  // Alle Eingabefelder leeren
  $newRow.find('input').val('');
  // Entferne Attribut für Dropdown-Neuinitialisierung
  $newRow.find('.dropdown-menu').removeAttr('data-dropdown-inited');
  
  // Füge die neue Zeile oberhalb des Plus-Buttons ein
  $(this).parent().before($newRow);
  
  // Initialisiere die Dropdowns im neuen Block neu
  initDropdowns($newRow.get(0));
});

  
  // DROPDOWN-MENÜ
  
  // Initialisiert ein einzelnes Dropdown-Element
  function initDropdown(dropdown) {
    // Verhindere Mehrfachinitialisierung (optional)
    if (dropdown.dataset.dropdownInited === "true") return;
    dropdown.dataset.dropdownInited = "true";
  
    const searchInput = dropdown.querySelector('input[type="search"]');
    const list = dropdown.querySelector('ul');
  
    // Beim Fokussieren: Wenn bereits eine Auswahl getroffen wurde, bleibt der Text erhalten.
    // Falls keine Auswahl vorliegt, passiert nichts – der Wert wird nicht zurückgesetzt.
    searchInput.addEventListener('focus', function() {
      // Hier nicht den selected-Status zurücksetzen, damit eine getroffene Auswahl erhalten bleibt.
      // Falls der Benutzer tippt, wird das im Input-Listener zurückgesetzt.
    });
  
    // Beim Eingeben: Wenn der Benutzer tippt, wird der "selected"-Status zurückgesetzt,
    // sodass eine neue Auswahl getroffen werden kann.
    searchInput.addEventListener('input', function() {
      // Falls der Benutzer anfängt zu tippen, wird der alte "selected"-Status entfernt.
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
  
    // Beim Verlassen (Blur) des Inputs: Falls keine Auswahl getroffen wurde, wird das Feld geleert.
    searchInput.addEventListener('blur', function() {
      // Timeout, damit Klick-Events auf Dropdown-Items zuerst verarbeitet werden können
      setTimeout(function() {
        if (searchInput.dataset.selected !== "true") {
          searchInput.value = "";
        }
      }, 200);
    });
  
    // Klick auf ein Dropdown-Item: Text in das Input übernehmen, "selected" markieren und Liste schließen.
    list.addEventListener('click', function(e) {
      const item = e.target.closest('.dropdown-item');
      if (item) {
        e.preventDefault();
        searchInput.value = item.textContent.trim();
        searchInput.dataset.selected = "true"; // Markiere, dass eine Auswahl getroffen wurde
        list.style.display = 'none';
      }
    });
  }
  
  // Initialisiert alle Dropdowns innerhalb eines bestimmten Containers
  function initDropdowns(container) {
    container.querySelectorAll('.dropdown-menu').forEach(function(dropdown) {
      initDropdown(dropdown);
    });
  }
  
  // Globaler Listener, der alle offenen Dropdowns schließt, wenn außerhalb geklickt wird
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
  