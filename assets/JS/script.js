// Initialize Firebase
var config = {
    apiKey: "AIzaSyCur5s9a4YE-tuL_5x8StDSOQoYub23y_c",
    authDomain: "ziyad-train-scheduler.firebaseapp.com",
    databaseURL: "https://ziyad-train-scheduler.firebaseio.com",
    projectId: "ziyad-train-scheduler",
    storageBucket: "ziyad-train-scheduler.appspot.com",
    messagingSenderId: "250792437856"
};
firebase.initializeApp(config);

var dataBase = firebase.database();

var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";

$("#trainButton").on("click", function(){
    // storing values of input in variables
    trainName = $("#nameInput").val().trim();
    destination = $("#destinationInput").val().trim();
    firstTrainTime = moment($("#firstTrainInput").val().trim(),"HH:mm").subtract(10, "years").format("X");
    frequency = $("#frequencyInput").val().trim();
    // storing our variables in one object
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrainTime,
        frequency: frequency
    }

    // grabbing values of object and saving it in database
    dataBase.ref().push(newTrain);

    $("#nameInput").val();
    $("#destinationInput").val();
    $("#firstTrainInput").val();
    $("#frequencyInput").val();

    return false;
})

dataBase.ref().on("child_added", function(snapshot) {

    // grabbing data from realtime database and store it variables
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var firstTrainTime = snapshot.val().firstTrainTime;
    var frequency = snapshot.val().frequency;
    // calculating time for the frequency of train arrivals / time left for the next train arrival / and how many minutes away
    var remainder = moment().diff(moment.unix(firstTrainTime), "minutes")%frequency;
    var minutes = frequency - remainder;
    var arrival = moment().add(minutes, "m").format("hh:mm A");

    // appending results stored in database to our table
    $("#trains > tBody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" 
        + firstTrainTime + "</td><td>" + frequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td><tr>");
})



