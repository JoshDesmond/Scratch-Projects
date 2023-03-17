use std::io;
use rand::Rng;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..=100);

    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    let guess: u32 = guess.trim().parse().expect("Input should be a number");

    println!("You guessed: {guess}");

    if guess == secret_number {
        println!("Correct!");
    } else {
        println!("Wrong, secret number was {secret_number}");
    }
}
