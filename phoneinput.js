document.addEventListener("DOMContentLoaded", function () {
    var phoneInputs = document.querySelectorAll('input[data-tel-input]');

    var getInputNumbersValue = function (input) {
        // Return stripped input value — just numbers
        return input.value.replace(/\D/g, '');
    }

    var onPhonePaste = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                // formatting will be in onPhoneInput handler
                input.value = inputNumbersValue;
                return;
            }
        }
    }

    var onPhoneInput = function (e) {
        var input = e.target,
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
            var firstSymbols = (inputNumbersValue[0] == "0") ? "+38" : "+38";
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
    var onPhoneKeyDown = function (e) {
        // Clear input after remove last symbol
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }
    for (var phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    }
})
