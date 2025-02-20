export const inBetweenTwoLetter =
  /^[a-zA-Z0-9]+([ &()'_-][a-zA-Z0-9]+)*[a-zA-Z0-9]$/; //Only when there's a minimum of 2 letters.

export const inBetweenOneLetter = /^[a-zA-Z0-9]+([ &()'_-]?[a-zA-Z0-9.])*$/;

export const isValidName = /^[a-zA-Z]+(?:-[a-zA-Z]+)*$/;

export const containsNumbers = /\d/;

export const allowFullStop =
  /^[a-zA-Z0-9]+([ &'().,-][a-zA-Z0-9. ]+)*[a-zA-Z0-9.]$/;

export const correctEmail = /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$/i;

export const validateEmail = (value: string) => {
  if (value) {
    const valid = value.match(correctEmail);
    if (!valid) {
      return "Email address must be a valid Email";
    }
  }
  return true;
};

export const validateUrl = (url: string, allowEmpty?: boolean) => {
  // Regular expression to match any valid URL in "something.com" format
  const regex = /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
  const isEmpty = allowEmpty && url.length === 0;
  return regex.test(url) || isEmpty ? true : "URL address must be a valid URL";
};

export const validateLettersAndWords = (inputText: string) => {
  return /^[a-zA-Z\s]*$/.test(inputText); // True if it contains only letters and false if it contains special characters and digits
};

export const validateCompoundName = (value: string) => {
  if (value) {
    // Check if the value contains numbers
    if (containsNumbers.test(value)) {
      return "The name must not contain numbers.";
    }

    // Check if the value matches the regular expression
    const hasTwoWords = value.match(inBetweenOneLetter);

    if (!hasTwoWords) {
      return "Spaces and special characters must not start or end a word.";
    }
  }
  return true;
};

export const validateName = (value: string) => {
  if (value) {
    if (!isValidName.test(value)) {
      return "Name must contain only letters.";
    }
  }
  return true;
};

export const handleKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  if (!/^[a-zA-Z0-9-_'()& ]+$/.test(event.key)) {
    event.preventDefault();
  }
};

export const handleKeyDownStrict = (
  event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  if (!/^[a-zA-Z0-9-' ]+$/.test(event.key)) {
    event.preventDefault();
  }
};

export const handleKeyDownAlt = (
  event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  if (!/^[a-zA-Z0-9-_'/()&. ]+$/.test(event.key)) {
    event.preventDefault();
  }
};

export const handleKeyDownNumbers = (
  event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const isNumber = /^[0-9]$/.test(event.key);
  const isArrowKey = /^Arrow(Left|Right)$/.test(event.key);
  const isBackspace = event.key === "Backspace";

  if (!(isNumber || isBackspace || isArrowKey)) {
    event.preventDefault();
  }
};

export const validateNumericCharacterLength = (value: string, length = 4) => {
  const isValidNumberLength = new RegExp(`^\\d{${length}}$`);

  if (!isValidNumberLength.test(value)) {
    return `Field must contain exactly ${length} numeric characters`;
  }
  return true;
};
