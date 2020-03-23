<template>
    <div>
        <b-jumbotron bg-variant="danger" text-variant="light">
            <template v-slot:header>SAW ~ Simple Additive Weighting</template>

            <template v-slot:lead>
                Bagian ini untuk uji coba penggunaan metode SAW dalam menentukan pemenang lelang
            </template>
        </b-jumbotron>
        <b-card img-fluid style="margin:10px;">
            <h1>Table penilaian kriteria</h1>
            <hr>
            <b-table striped hover :items="rulcrit" :fields="fieldcrit"></b-table>
        </b-card>
        <b-card img-fluid style="margin:10px;">
            <h1>Pilih barang</h1>
            <h5 style="color:red;">Pilih / buat baru kategori barang yang ingin dibandingkan antar supplier</h5>
            <b-form inline>
                <b-form-group label="Buat / Pilih">
                    <b-form-radio v-model="selrad" name="some-radios" value="A">Pilih Barang</b-form-radio>
                    <b-form-radio v-model="selrad" name="some-radios" value="B">Buat Baru</b-form-radio>
                </b-form-group>
            </b-form>
            <b-form inline v-if="selrad == 'B'">
                <b-form-group style="margin:5px;" label="Nama Barang:">
                    <b-form-input style="margin-right:5px;" required v-model="namabarang" placeholder="eg: LCD 32 inch">
                    </b-form-input>
                    <b-button variant="primary" @click.prevent="newitem">Create</b-button>
                </b-form-group>
            </b-form>
            <b-form inline v-if="selrad == 'A'">
                <b-form-group style="margin:5px;" label="Nama Barang:">
                    <b-form-select style="margin-right:5px;" required v-model="sellistbarang" :options="listbarang">
                    </b-form-select>
                    <b-button @click.prevent="selectlist" variant="primary">Select</b-button>
                </b-form-group>
            </b-form>
            Sel {{sellistbarang}}
        </b-card>
        <calcview :deta="deta" v-if="ready" ref="saw"></calcview>
    </div>
</template>
<script>
    import httpmake from '@/library/network.js'
    import calc from '@/components/frame/calcsaw'
    export default {
        components: {
            calcview: calc
        },
        data() {
            return {
                selindex : 0,
                deta: Object,
                ready: false,
                sellistbarang: "",
                listbarang: [],
                namabarang: "",
                selrad: "B",
                fieldcrit: [{
                    key: 'point',
                    variant: 'primary'
                }, {
                    key: 'harga'
                }, {
                    key: 'sni'
                }, {
                    key: 'beli'
                }],
                rulcrit: [{
                    point: 'POINT',
                    harga: '50%',
                    sni: '25% untuk ada / 0 untuk tidak ada',
                    beli: '25% untuk pernah / 0 untuk tidak pernah'
                }],
            }
        },
        created() {
            this.refreshlist()
        },
        methods: {
            refreshlist() {
                var list = httpmake.makeGETrequest(this.$apiurl)
                list.then((data) => {
                    if (!data.error) {
                        for (var dat in data) {
                            this.listbarang.push({
                                value: data[dat]._id,
                                text: data[dat].name
                            })
                        }
                    }
                })
            },
            newitem() {
                if (this.namabarang == "") {
                    alert('Masukkan Nama Barang!')
                } else {
                    var prams = {
                        name: this.namabarang
                    }
                    var rets = httpmake.makePOSTrequest(this.$apiurl, prams)
                    rets.then((deta) => {
                        if (deta.name != "" || deta.name != undefined) {
                            alert('Success Adding Item!')
                            this.listbarang = []
                            this.refreshlist()
                            this.namabarang = ""
                        }
                    })
                }
            },
            selectlist() {
                var index = this.listbarang.findIndex(x => x.value == this.sellistbarang)
                this.ready = true
                this.deta = {
                    id: this.sellistbarang,
                    barang : this.listbarang[index].text
                }
                console.log(index)
                this.$refs.saw.populatelist(this.sellistbarang)
            }

        }
    }
</script>
<style scoped>
    .card h1 {
        text-align: center;
    }
</style>