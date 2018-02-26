// Grab the articles as a json
$.getJSON("/articles", function(data) {
  
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<br>"+"<button data-id='" + data[i]._id + "' id='noteView'>View Note</button>" + "<br>" + data[i].title + "<br>" + "<a href='" + data[i].link + "' target='_blank'>" +  data[i].link + "</a>"+"<br>");  
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "#noteView", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h3>" + data.title + "</h3>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it along with delete button
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>"+ "<button data-id='" + data._id + "' id='deleter'>Delete Note</button>" );
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  
  //Perform the scrape by clicking the Scrape button
$("#scrape").on("click", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })

  .done(function(data) {
    console.log(data)
    window.location = "/"

})

});

// When you click the Delete Note button
$(document).on("click", "#deleter", function() {
  // Grab the id associated with the article
  var thisId = $(this).attr("data-id");

  // Run a DELETE request to delete the note
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  })
    // still need to empty the notes div as before
    .then(function() {
      $("#notes").empty();
    });

  // And remove the values entered in the input and textarea as before
  $("#titleinput").val("");
  $("#bodyinput").val("");
});