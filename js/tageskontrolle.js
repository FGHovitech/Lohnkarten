$(document).ready(function() {
  // Beim Laden sind alle Felder readonly – plus/minus-Buttons sind per HTML/CSS ausgeblendet.

  fillDummyData();
  // Bearbeiten-/Speichern-Button
  $('.btn-bearbeiten').on('click', function() {
    var $btn = $(this);
    var $row = $btn.closest('.eingabemaske-row');
    
    if ($btn.text().trim() === 'Bearbeiten') {
      // In den Bearbeitungsmodus wechseln:
      // - Entferne das readonly-Attribut von allen Inputs im Mitarbeiter-Container
      $row.find('input').prop('readonly', false);
      // - Blende alle Plus-/Minus-Buttons ein (zum Beispiel alle, die innerhalb dieser Zeile liegen)
      $row.find('.btn-outline-secondary, .btn-outline-danger').show();
      // - Ändere den Buttontext in "Speichern"
      $btn.text('Speichern');
    } else {
      // Speichern: Eingabefelder wieder schreibgeschützt machen und Buttons ausblenden
      $row.find('input').prop('readonly', true);
      $row.find('.btn-outline-secondary, .btn-outline-danger').hide();
      $btn.text('Bearbeiten');
      
      // Hier kannst du zusätzlich eine Speichern-Funktion (z. B. per AJAX) implementieren.
    }
  });
  
  // Geprüft-Button: Markiert den Mitarbeiter als kontrolliert
  $('.btn-geprueft').on('click', function() {
    var $btn = $(this);
    var $row = $btn.closest('.eingabemaske-row');
    
    // Toggle: Falls die Zeile noch nicht als approved markiert ist…
    if (!$row.hasClass('approved')) {
      // Zeile als "geprüft" markieren (grüner Rahmen)
      $row.addClass('approved');
      // Button in Rot ändern und "Ungeprüft" anzeigen
      $btn.removeClass('btn-success').addClass('btn-danger').text('Ungeprüft');
      $row.find('.btn-bearbeiten').hide();
    } else {
      // Rückgängig machen: Rahmen entfernen, Button zurücksetzen
      $row.removeClass('approved');
      $btn.removeClass('btn-danger').addClass('btn-success').text('Geprüft');
      $row.find('.btn-bearbeiten').show();
    }
  });
});

function fillDummyData() {
  $('.eingabemaske-row').each(function() {
    var $row = $(this);
    
    // Mitarbeiterdaten füllen
    $row.find('.employee-container input[placeholder="Mitarbeiter"]').val("Max Mustermann");
    $row.find('.employee-container input[name="gesamtStunden"]').val("8");
    
    // Sicherstellen, dass mindestens zwei Kostenstellen vorhanden sind
    var $innerWrapper = $row.find('.inner-container .inner-section-wrapper');
    var $sections = $innerWrapper.find('.eingabemaske-abschnitt');
    if ($sections.length < 2) {
      var $firstSection = $sections.first();
      // Zweite Kostenstelle erzeugen, indem die erste kopiert wird
      var $clone = $firstSection.clone(true, true);
      // Optional: vorhandene Eingaben in der geklonten Zeile leeren
      $clone.find('input').val('');
      $innerWrapper.append($clone);
      $sections = $innerWrapper.find('.eingabemaske-abschnitt');
    }
    
    // Erste Kostenstelle
    var $costSection1 = $sections.eq(0);
    $costSection1.find('input[placeholder="Kostenstelle"]').val("310");
    $costSection1.find('.nebenzeiten-group .nebenzeitenDropdown input[placeholder="Nebenzeit"]').val("Vorgang 1");
    $costSection1.find('.nebenzeiten-group input[name="nebenzeiten_number[]"]').val("15");
    $costSection1.find('input[placeholder="Gewichtsklasse"]').val("Gewichtsklasse 1");
    $costSection1.find('input[placeholder="Stückzahl"]').val("100");
    $costSection1.find('input[placeholder="VGZ"]').val("50");
    $costSection1.find('input[placeholder="Akkordmin."]').val("30");
    $costSection1.find('input[placeholder="Gebr.Min."]').val("25");
    
    // Zweite Kostenstelle
    var $costSection2 = $sections.eq(1);
    $costSection2.find('input[placeholder="Kostenstelle"]').val("305");
    $costSection2.find('.nebenzeiten-group .nebenzeitenDropdown input[placeholder="Nebenzeit"]').val("Vorgang 2");
    $costSection2.find('.nebenzeiten-group input[name="nebenzeiten_number[]"]').val("20");
    $costSection2.find('input[placeholder="Gewichtsklasse"]').val("Gewichtsklasse 2");
    $costSection2.find('input[placeholder="Stückzahl"]').val("150");
    $costSection2.find('input[placeholder="VGZ"]').val("75");
    $costSection2.find('input[placeholder="Akkordmin."]').val("40");
    $costSection2.find('input[placeholder="Gebr.Min."]').val("35");
    
    // Stundenzuschläge füllen
    var $stundenGroup = $row.find('.stunden-group');
    $stundenGroup.find('input[placeholder="10%"]').val("10");
    $stundenGroup.find('input[placeholder="25%"]').val("25");
    $stundenGroup.find('input[placeholder="40%"]').val("40");
  });
}