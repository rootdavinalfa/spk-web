<template>
    <div>
        <b-card img-fluid style="margin:10px;">
            <h1>Define data untuk barang {{deta.barang}}</h1>
            <h5>Masukkan data pada field-field dibawah ini.Jika sudah,klik + data harus lebih dari satu!</h5>
            <hr>
            <b-card-text>
                <b-form inline>
                    <b-form-group style="margin:5px;" label="Supplier Barang:">
                        <b-form-input required v-model="supplier" placeholder="eg: Hitachi Co.Ltd"></b-form-input>
                    </b-form-group>
                    <b-form-group style="margin:5px;" label="Harga">
                        <b-form-input required v-model="harga" type="number" placeholder="eg: 1000000"></b-form-input>
                    </b-form-group>
                    <b-form-group style="margin:5px;" label="SNI?">
                        <b-form-select required v-model="sniselected" :options="snioption"></b-form-select>
                    </b-form-group>
                    <b-form-group style="margin:5px;" label="Sudah Pernah Beli?">
                        <b-form-select required v-model="byselected" :options="byoption"></b-form-select>
                    </b-form-group>
                    <b-form-group style="margin:5px;margin-left:10px;" label="Add">
                        <b-button @click.prevent="add2list" variant="success">
                            <b-icon icon="plus"></b-icon>
                        </b-button>
                    </b-form-group>
                </b-form>
                <hr>
                <h3>List Data:</h3>
                <transition name="fade">
                    <div v-if="listdata.length == 0">
                        <h6>No Data.</h6>
                    </div>
                </transition>
                <b-list-group>
                    <b-list-group-item v-for="(data,index) in listdata" v-bind:key="index">
                        <b-badge variant="primary" pill style="margin:2px;">{{index+1}}</b-badge>
                        <h3>{{data.supplier}}</h3>
                        <br>
                        <b> Harga:</b> Rp.{{data.harga}}
                        <br>
                        <b> SNI:</b> {{data.sni}}
                        <br>
                        <b> Pernah Beli:</b> {{data.pernah}}
                        <b-button @click.prevent="deletedata(index)" variant="danger" style="margin:2px;">
                            <b-icon icon="trash"></b-icon>
                        </b-button>
                    </b-list-group-item>
                </b-list-group>
                <hr>
                <transition name="fade">
                    <b-button @click.prevent="savelist" style="margin:5px;" v-if="listdata.length > 1"
                        variant="success">Save</b-button>
                </transition>
                <transition name="fade">
                    <b-button @click.prevent="calculate" style="margin:5px;" v-if="listdata.length > 1"
                        variant="primary">Calculate</b-button>
                </transition>
            </b-card-text>
        </b-card>

        <b-card img-fluid style="margin:10px;">
            <h1>Hasil</h1>
            <h5>Bagian ini menunjukan perhitungan yang pernah dilakukan oleh anda.</h5>
            <h5>Berikut ranking berdasar dari yang paling harus dipilih oleh anda!</h5>
            <b-list-group-item v-for="(data,index) in hasil" v-bind:key="index">
                <b-badge variant="primary" pill style="margin:2px;">{{index+1}}</b-badge>
                <h3>{{data.supplier}}</h3>
                <h5><b>Score:</b> {{Number.parseFloat(data.weight * 100).toPrecision(4)}}%</h5>
                <br>
                <b> Weight:</b> {{data.weight}}
            </b-list-group-item>
        </b-card>
    </div>
</template>
<script>
    import httpmake from '@/library/network.js'
    export default {
        props: {
            deta: Object
        },
        watch: {
            deta: function (newVal, old) {
                console.log(old)
                this.deta = newVal
            }
        },
        data() {
            return {
                supplier: "",
                harga: 0,
                sniselected: null,
                byselected: 'Belum Pernah',
                listdata: [],
                byoption: [{
                        value: 'Belum Pernah',
                        text: 'Belum Pernah'
                    },
                    {
                        value: 'Sudah Pernah',
                        text: 'Sudah Pernah'
                    }
                ],
                snioption: [{
                        value: null,
                        text: 'Pilih status SNI'
                    },
                    {
                        value: 'Ada',
                        text: 'Ada'
                    },
                    {
                        value: 'Tidak Ada',
                        text: 'Tidak Ada'
                    },
                ],
                hasil: [],
            }
        },
        methods: {
            populatelist(id) {
                this.listdata = []
                var data = httpmake.makeGETrequest(this.$apiurl + 'supplier/' + id)
                data.then((dat) => {
                    for (let x in dat) {
                        this.listdata.push({
                            supplier: dat[x].supplier,
                            harga: dat[x].harga,
                            sni: dat[x].sni,
                            pernah: dat[x].beli
                        })
                    }
                })
            },
            add2list() {
                if (this.sniselected == null || this.supplier == '') {
                    alert('Please enter field!')
                } else {
                    this.listdata.push({
                        supplier: this.supplier,
                        harga: this.harga,
                        sni: this.sniselected,
                        pernah: this.byselected
                    })
                    this.supplier = ""
                    this.harga = 0
                    this.sniselected = null
                    this.byselected = 'Belum Pernah'
                }

            },
            deletedata(index) {
                console.log(index)
                this.listdata.splice(index, 1)
            },
            savelist() {
                var listup = []
                for (let i in this.listdata) {
                    listup.push({
                        itemid: this.deta.id,
                        supplier: this.listdata[i].supplier,
                        harga: this.listdata[i].harga,
                        sni: this.listdata[i].sni,
                        beli: this.listdata[i].pernah,
                    })
                }
                var rets = httpmake.makePOSTrequest(this.$apiurl + "supplier/save", listup)
                rets.then((ret) => {
                    if (ret.insertedCount == listup.length) {
                        alert('Saved!')
                    }
                })
            },
            calculate() {
                // Step for SAW methods
                // Normalize tiap kriteria dalam rumus max
                // Menghitung tiap alternatif dengan hasil normalize dan bobot penilian 30% etc
                // Urutkan dari yang terbesar

                //Convert criteria to int representative 1/0
                var listcalculate = []
                for (let i in this.listdata) {
                    let supplier = this.listdata[i].supplier
                    let harga = this.listdata[i].harga
                    let sni = this.listdata[i].sni
                    let beli = this.listdata[i].pernah

                    listcalculate.push({
                        supplier: supplier,
                        harga: parseInt(harga),
                        sni: sni == 'Ada' ? 1 : 0,
                        beli: beli == 'Sudah Pernah' ? 1 : 0,
                    })
                }
                //Check max harga
                let mins = listcalculate.reduce(function (prev, current) {
                    return (prev.harga < current.harga) ? prev : current
                })
                //C1,C2,C3 respectively harga,sni,pernah
                var normals = []
                for (let i in listcalculate) {
                    let c1 = mins.harga / listcalculate[i].harga
                    let c2 = listcalculate[i].sni / 1
                    let c3 = listcalculate[i].beli / 1
                    normals.push({
                        supplier: listcalculate[i].supplier,
                        harga: c1,
                        sni: c2,
                        beli: c3,
                    })
                }
                console.info("Beware!!!! Here is normalize data")
                console.info(normals)
                //C1 50% 0.5 C2 and C3 25% 0.25
                var summary = []
                for (let i in normals) {
                    let v = (normals[i].harga * 0.5) + (normals[i].sni * 0.25) + (normals[i].beli * 0.25)
                    summary.push({
                        supplier: normals[i].supplier,
                        weight: v
                    })
                }
                summary.sort(function (prev, current) {
                    return (prev.weight < current.weight) ? 1 : -1
                })
                this.hasil = summary
                console.info("Beware!!!! Here is summary has been sorted")
                console.info(summary)
            },
        }
    }
</script>
<style scoped>
    .card h1 {
        text-align: center;
    }
</style>