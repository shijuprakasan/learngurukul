<?php
if(isset($_POST['submit'])){
    $to = "learngurukulshubha@gmail.com"; // this is your Email address
    $from = $_POST['email']; // this is the sender's Email address
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $description = $_POST['description'];

    $subject = "Form submission" . $name;
    $message = "Enquery From: " . $name . "\n\n" . "Phone: " . $phone . "\n\n" . "Wrote the following:" . "\n\n" . $description;
    $headers = "From:" . $from;

    $subject2 = "Learn Gurukul - Enquery";
    $message2 = "Here is a copy of your enquery with Learn Gurukul" . "\n\n Name" . $name . "\n\n Phone" . $name . "\n\n" . $description;
    $headers2 = "From:" . $to;

    mail($to,$subject,$message,$headers);
    mail($from,$subject2,$message2,$headers2); // sends a copy of the message to the sender

    echo "Mail Sent. Thank you " . $name . ", we will contact you shortly.";
    // You can also use header('Location: thank_you.php'); to redirect to another page.
    }
?>