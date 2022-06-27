<script>
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import { InlineCalendar } from "svelte-calendar";
    import Textfield from "@smui/textfield";
    import Icon from "@smui/textfield/icon";
    import Button, { Label } from "@smui/button";
    import dayjs from "dayjs";

    export let transactions = [];
    export let open = false;

    let date = "";
    let amount = "";
    let description = "";
    let today = new Date();

    let store;
    $: if ($store?.selected) {
        date = dayjs($store?.selected).format("MM/DD/YYYY");
    }

    const theme = {
        calendar: {
            width: "600px",
            shadow: "0px 0px 30px rgba(0.0, 0.0, 0.0, .0)",
            colors: {
                background: {
                    highlight: "#333",
                },
            },
        },
    };

    const resetValues = () => {
        amount = "";
        description = "";
        // restore calendar day to today
        store.setDay(today);
    }

    const handleCancel = () => {
        resetValues();
    };

    const handleSubmit = async () => {
        let body = JSON.stringify({
            date: date,
            amount: parseFloat(amount) * 100,
            description: description,
        });

        try {
            const res = await fetch("/transactions.json", {
                method: "POST",
                body: body,
            });

            if (res.ok) {
                let created = await res.json();
                transactions = [...transactions, created];
                transactions.sort((a, b) => {
                    return (a.day >= b.day? -1 : 1);
                });

                //if (created.description.includes("fun")) {
                //	fun += created.amount;
                //	console.log(fun);
                //}
            }
        } catch (err) {
            console.log(err);
        }
        resetValues();
    };
</script>

<Dialog
    bind:open
    aria-labelledby="simple-title"
    aria-describedby="simple-content"
    surface$style="width: 650px; max-width: calc(100vw - 32px);"
>
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <Title id="simple-title">Add Transaction</Title>
    <Content id="simple-content">
        <div>
            <InlineCalendar bind:store {theme} selected={today} />

            <div class="grid">
                <Textfield disabled bind:value={date} label="Date">
                    <Icon class="material-icons" slot="leadingIcon">event</Icon>
                </Textfield>
                <Textfield
                    bind:value={amount}
                    label="Amount"
                    type="number"
                    input$step=".01"
                >
                    <Icon class="material-icons" slot="leadingIcon">paid</Icon>
                </Textfield>
                <Textfield bind:value={description} label="Description">
                    <Icon class="material-icons" slot="leadingIcon"
                        >article</Icon
                    >
                </Textfield>
            </div>
        </div>
    </Content>
    <Actions>
        <Button on:click={() => handleCancel()}>
            <Label>Cancel</Label>
        </Button>
        <Button
            on:click={() => handleSubmit()}
            disabled={amount == "" || description == ""}
        >
            <Label>Submit</Label>
        </Button>
    </Actions>
</Dialog>

<slot {transactions} />

<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        text-align: left;
        align-items: left;
        width: 600px;
    }
</style>
