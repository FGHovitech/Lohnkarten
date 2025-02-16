$(document).ready(function() {
  var originalInnerSectionTemplate = null;
    // Initial beim Laden der Seite: Minus‑Buttons entsprechend der vorhandenen Zeilen ausblenden oder einblenden
  $(document).ready(function() {
    $('.gewichtsklasse-group').each(function() {
      updateMinusButtonForGewichtsklasse($(this));
    });
    $('.eingabemaske-row').each(function() {
      updateMinusButtonForNebenzeiten($(this));
    });
    originalInnerSectionTemplate = $('.inner-section-wrapper .eingabemaske-abschnitt').first().clone();
  });


  // Nebenzeiten-Plus-Button: Fügt innerhalb eines inneren Abschnitts eine weitere Nebenzeitenszeile hinzu.
  $(document).on('click', '.add-nebenzeiten', function() {
    var $group = $(this).closest('.nebenzeiten-group');
    var $template = $group.find('.nebenzeiten-row').first();
    var $newRow;
  
    if ($template.length === 0) {
      // Falls keine Nebenzeiten-Zeile vorhanden ist, erzeuge eine neue Zeile aus einem Template-HTML
      var templateHtml = '' +
        '<div class="d-flex input-group mb-1 nebenzeiten-row">' +
          '<div class="nebenzeitenDropdown dropdown-menu d-block position-relative pt-0 mx-0 rounded-3 shadow" data-bs-theme="light">' +
            '<form>' +
              '<input type="search" class="form-control" autocomplete="off" placeholder="Nebenzeit">' +
            '</form>' +
            '<ul class="list-unstyled mb-0" style="position: absolute; top: 100%; left: 0; width: 100%; display: none;">' +
              '<li>' +
                '<a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">Vorgang 1</a>' +
              '</li>' +
              '<li>' +
                '<a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">Vorgang 2</a>' +
              '</li>' +
            '</ul>' +
          '</div>' +
          '<input type="number" name="nebenzeiten_number[]" class="form-control minutenEingabe" placeholder="Minuten">' +
        '</div>';
      $newRow = $(templateHtml);
    } else {
      // Andernfalls klone die erste vorhandene Zeile
      $newRow = $template.clone();
    }
    
    // Leere die Eingaben
    $newRow.find('input').val('');
    $newRow.find('select').prop('selectedIndex', 0);
  
    // Füge die neue Zeile oberhalb des Buttons ein
    $(this).parent().before($newRow);
  
    // Entferne das Attribut, damit das Dropdown neu initialisiert werden kann
    $newRow.find('.dropdown-menu').removeAttr('data-dropdown-inited');
  
    // Initialisiere die Dropdowns im neuen Block
    initDropdowns($newRow.get(0));
  
    // Aktualisiere die Sichtbarkeit der Nebenzeiten-Minus-Buttons im gesamten Mitarbeiter-Container
    var $employeeContainer = $(this).closest('.eingabemaske-row');
    updateMinusButtonForNebenzeiten($employeeContainer);
  });
  
  // Neue Kostenstelle:
  $(document).on('click', '.add-inner-section', function() {
    var $innerContainer = $(this).closest('.inner-container');
    var $wrapper = $innerContainer.find('.inner-section-wrapper');
    var $btn = $(this).detach(); // Button vorübergehend entfernen
  
    // Erstelle einen neuen inneren Abschnitt aus dem Original-Template
    var $newSection = originalInnerSectionTemplate.clone();
  
    // Füge den neuen Abschnitt in den Wrapper ein und hänge den Button wieder an
    $wrapper.append($newSection);
    $newSection.after($btn);
  
    // Entferne das Attribut für die Dropdown-Neuinitialisierung
    $newSection.find('.dropdown-menu').removeAttr('data-dropdown-inited');
  
    // Initialisiere die Dropdowns im neuen Abschnitt
    initDropdowns($newSection.get(0));
  
    // Aktualisiere die Sichtbarkeit der Nebenzeiten-Minus-Buttons:
    var $employeeContainer = $(this).closest('.eingabemaske-row');
    updateMinusButtonForNebenzeiten($employeeContainer);
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

  // Neue Gewichtsklasse, Stückzahl & VGZ:
  $(document).on('click', '.add-gewichtsklasse', function() {
    var $group = $(this).closest('.gewichtsklasse-group');
    // Klonen der ersten Zeile der Gruppe
    var $newRow = $group.find('.gewichtsklasse-row').first().clone();
    // Eingabefelder leeren
    $newRow.find('input').val('');
    // Attribut für Dropdown-Neuinitialisierung entfernen
    $newRow.find('.dropdown-menu').removeAttr('data-dropdown-inited');
    
    // Neue Zeile oberhalb des Plus-Buttons einfügen
    $(this).parent().before($newRow);
    
    // Dropdowns im neuen Block initialisieren
    initDropdowns($newRow.get(0));
    
    // Minus-Button Sichtbarkeit aktualisieren
    updateMinusButtonForGewichtsklasse($group);
  });


  // Minus‑Button bei Gewichtsklasse
  $(document).on('click', '.minus-gewichtsklasse', function() {
    var $group = $(this).closest('.gewichtsklasse-group');
    var $rows = $group.find('.gewichtsklasse-row');
    if ($rows.length > 1) {
      // Entfernt die letzte Gewichtsklasse-Zeile
      $rows.last().remove();
    }
    updateMinusButtonForGewichtsklasse($group);
  });

  // Minus‑Button bei Nebenzeiten
  $(document).on('click', '.minus-nebenzeiten', function() {
    // Bestimme den gesamten Mitarbeiter-Container (eingabemaske‑row)
    var $employeeContainer = $(this).closest('.eingabemaske-row');
    var $allNebenzeiten = $employeeContainer.find('.nebenzeiten-row');
    
    // Falls weniger als zwei Nebenzeiten im gesamten Mitarbeiter vorhanden sind, passiert nichts.
    if ($allNebenzeiten.length < 2) {
      return;
    }
    
    // Entferne in dem aktuellen Kostenstellen-Container (nebenzeiten-group) die letzte Nebenzeiten-Zeile
    var $group = $(this).closest('.nebenzeiten-group');
    var $rows = $group.find('.nebenzeiten-row');
    if ($rows.length > 0) {
      $rows.last().remove();
    }
    
    updateMinusButtonForNebenzeiten($employeeContainer);
  });
  

// Hilfsfunktion: Aktualisiert die Sichtbarkeit des Minus‑Buttons für Gewichtsklassen
function updateMinusButtonForGewichtsklasse($group) {
  var $rows = $group.find('.gewichtsklasse-row');
  var $minusButton = $group.find('.minus-gewichtsklasse');
  if ($rows.length > 1) {
    $minusButton.show();
  } else {
    $minusButton.hide();
  }
}

// Hilfsfunktion: Aktualisiert die Sichtbarkeit der Nebenzeiten‑Minus‑Buttons für einen Mitarbeiter-Container
function updateMinusButtonForNebenzeiten($employeeContainer) {
  // Zählt alle Nebenzeitenzeilen innerhalb des gesamten Mitarbeiters
  var totalRows = $employeeContainer.find('.nebenzeiten-row').length;
  if (totalRows > 1) {
    $employeeContainer.find('.minus-nebenzeiten').show();
  } else {
    $employeeContainer.find('.minus-nebenzeiten').hide();
  }
}

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
 