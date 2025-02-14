$(document).ready(function() {
    // Arbeitsvorgang-Plus-Button: Fügt innerhalb eines inneren Abschnitts eine weitere Arbeitsvorgangszeile hinzu.
    $(document).on('click', '.add-arbeitsvorgang', function() {
      var $group = $(this).closest('.arbeitsvorgang-group');
      var $newRow = $group.find('.arbeitsvorgang-row').first().clone();
      $newRow.find('input').val('');
      $newRow.find('select').prop('selectedIndex', 0);
      $(this).parent().before($newRow);
    });
    
    // Neuer Abschnitt innerhalb eines Mitarbeiters:
  // Neuer Abschnitt innerhalb eines Mitarbeiters:
  $(document).on('click', '.add-inner-section', function() {
    // Zuerst den inneren Container speichern
    var $innerContainer = $(this).closest('.inner-container');
    var $wrapper = $innerContainer.find('.inner-section-wrapper');
    // Danach den Button entfernen
    var $btn = $(this).detach();
    
    // Klonen des letzten vorhandenen Abschnitts
    var $newSection = $wrapper.children('.eingabemaske-abschnitt').last().clone();
    // Eingabefelder leeren und Auswahl zurücksetzen
    $newSection.find('input').val('');
    $newSection.find('select').prop('selectedIndex', 0);
    // Neuen Abschnitt anhängen und den Button unter diesen einfügen
    $wrapper.append($newSection);
    $newSection.after($btn);
  });
    
    // Neuer Mitarbeiter:
    $(document).on('click', '.add-eingabemaske', function() {
      // Den "Neuer Mitarbeiter"-Button vom aktuellen Platz entfernen
      var $employeeBtn = $(this).detach();
      // Klone die erste eingabemaske-row als Vorlage
      var $newRow = $('#eingabemaske-container .eingabemaske-row').first().clone();
      // Alle Eingabefelder leeren und alle Selects auf den Standardwert setzen
      $newRow.find('input').val('');
      $newRow.find('select').prop('selectedIndex', 0);
      // In jedem inner-container: Nur den ersten inneren Abschnitt beibehalten
      $newRow.find('.inner-container').each(function() {
        var $wrapper = $(this).find('.inner-section-wrapper');
        $wrapper.children('.eingabemaske-abschnitt').not(':first').remove();
      });
      // Füge die neue Zeile ans Ende des Containers ein
      $('#eingabemaske-container').append($newRow);
      // Hänge den "Neuer Mitarbeiter"-Button unter die neue Zeile an
      $newRow.after($employeeBtn);
    });
  });
  