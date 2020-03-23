<template>
    <div id="home">
        <h1>Copyright 2020,Davin Alfarizky Putra Basudewa</h1>
        <h4>1101171082</h4>
        <b-card deck title="Tugas Sistem Pendukung Keputusan"
            sub-title="Silahkan pilih salah satu pada card di bawah ini!" img-fluid>
            <b-container fluid>
                <b-row cols="3" cols-md="5">
                    <b-col class="hvr-grow">
                        <b-card title="AHP ~ Analytic hierarchy process" bg-variant="dark" text-variant="light">
                            <b-card-text>Untuk melakukuan perhitungan dengan metode AHP</b-card-text>
                            <b-button variant="primary">Lanjutkan...</b-button>
                        </b-card>
                    </b-col>
                    <b-col class="hvr-grow">
                        <b-card title="SAW ~ Simple Additive Weighting" bg-variant="danger" text-variant="light">
                            <b-card-text>Untuk melakukuan perhitungan dengan metode SAW</b-card-text>
                            <b-card-text>Dengan database noSQL (MongoDB)</b-card-text>
                            <b-button variant="success" to="saw">Lanjutkan...</b-button>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>
        </b-card>
    </div>
</template>
<script>
    export default {

    }
</script>

<style scoped>
    .hvr-grow {
        margin: 10px;
        padding: 5px;
        z-index: 0;
        display: inline-block;
        vertical-align: middle;
        transform: translateZ(0);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0);
        backface-visibility: hidden;
        -moz-osx-font-smoothing: grayscale;
        transition-duration: 0.3s;
        transition-property: transform;
    }

    .hvr-grow:hover,
    .hvr-grow:focus,
    .hvr-grow:active {
        z-index: 10;
        transform: scale(1.1);
        background-color: #FF3CAC;
        background-image: linear-gradient(270deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%);
    }
</style>