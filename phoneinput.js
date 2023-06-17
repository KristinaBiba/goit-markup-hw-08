document.addEventListener("DOMContentLoaded", function () {
    const phoneInputs = document.querySelectorAll('input[data-tel-input]');

    const getInputNumbersValue = function (input) {
        // Return stripped input value — just numbers
        return input.value.replace(/\D/g, '');
    }

    const onPhonePaste = function (e) {
        const input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        const pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            const pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                // formatting will be in onPhoneInput handler
                input.value = inputNumbersValue;
                return;
            }
        }
    }

    const onPhoneInput = function (e) {
        const input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            selectionStart = input.selectionStart,
            formattedInputValue = "";

        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            // Editing in the middle of input, not last symbol
            if (e.data && /\D/g.test(e.data)) {
                // Attempt to input non-numeric symbol
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["3", "8", "0"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] == "0") inputNumbersValue = "38" + inputNumbersValue;
            if (inputNumbersValue[0] == "8") inputNumbersValue = "3" + inputNumbersValue;
            const firstSymbols = (inputNumbersValue[0] == "0") ? "+38" : "+38";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 2) {
                formattedInputValue += '(' + inputNumbersValue.substring(2, 5);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(5, 8);
            }
            if (inputNumbersValue.length >= 9) {
                formattedInputValue += '-' + inputNumbersValue.substring(8, 10);
            }
            if (inputNumbersValue.length >= 11) {
                formattedInputValue += '-' + inputNumbersValue.substring(10, 12);
            }
        } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0, 17);
        }
        input.value = formattedInputValue;
    }
    const onPhoneKeyDown = function (e) {
        // Clear input after remove last symbol
        const inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }
    for (const phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    }
})
