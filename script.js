// =========================
// FIREBASE
// =========================

const firebaseConfig = {
  apiKey: "AIzaSyCf6VXOCH5CeO4d6iuHTQUKV7D5HlKvzsE",

  authDomain: "smartgudang.firebaseapp.com",

  projectId: "smartgudang",

  storageBucket: "smartgudang.firebasestorage.app",

  messagingSenderId: "760385737688",

  appId: "1:760385737688:web:93ab71daac4f489b4bd8ad",

  measurementId: "G-V5JLBET3NL"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

let data = [];
let riwayat = [];
let isAdmin = false;


// =========================
// LOGIN ADMIN
// =========================

function login(){

let user=document.getElementById("username").value;

let pass=document.getElementById("password").value;


if(user==="emon" && pass==="100907"){

isAdmin=true;

document.getElementById("loginPage")
.style.display="none";

document.querySelector(".form-box")
.style.display="block";

render();

alert("Login berhasil");

}else{

alert("Username atau password salah");

}

}


// =========================
// PENGUNJUNG
// =========================

function lihatStok(){

document.getElementById("loginPage")
.style.display="none";

document.getElementById("dashboard")
.style.display="block";

document.querySelector(".form-box")
.style.display="none";

isAdmin=false;

render();

}


// =========================
// BUKA LOGIN
// =========================

function bukaLogin(){

document.getElementById("loginPage")
.style.display="flex";

}


// =========================
// LOGOUT
// =========================

function logout(){

location.reload();

}


// =========================
// DARK MODE
// =========================

function toggleDark(){

document.body.classList.toggle("dark");

}


// =========================
// PASSWORD
// =========================

function togglePassword(){

let p=document.getElementById("password");

p.type=

p.type==="password"

?

"text"

:

"password";

}


// =========================
// LOAD DATA GUDANG
// =========================

function loadData(){

db.collection("gudang")

.onSnapshot((snapshot)=>{

data=[];

snapshot.forEach((doc)=>{

data.push({

id:doc.id,

...doc.data()

});

});

render();

});

}


// =========================
// LOAD RIWAYAT
// =========================

function loadRiwayat(){

db.collection("riwayat")

.orderBy("tanggal","desc")

.onSnapshot((snapshot)=>{

riwayat=[];

snapshot.forEach((doc)=>{

riwayat.push(doc.data());

});

renderRiwayat();

});

}


// =========================
// TAMBAH / KELUAR BARANG
// =========================

function tambah(){

if(!isAdmin){

alert("Hanya admin");

return;

}


let nama=

document.getElementById("nama")
.value.trim();

let warna=

document.getElementById("warna")
.value.trim();

let stok=

Number(

document.getElementById("stok")
.value

);

let lokasi=

document.getElementById("lokasi")
.value.trim();

let jenis=

document.getElementById("jenis")
.value;


if(

nama===""

||

warna===""

||

stok<=0

||

lokasi===""

){

alert("Isi semua data");

return;

}


let index=

data.findIndex(item=>

item.nama.toLowerCase()

===

nama.toLowerCase()

&&

item.warna.toLowerCase()

===

warna.toLowerCase()

);


// MASUK

if(jenis==="Masuk"){

if(index!=-1){

db.collection("gudang")

.doc(data[index].id)

.update({

stok:

data[index].stok

+

stok

});

}

else{

db.collection("gudang")

.add({

nama,

warna,

stok,

lokasi

});

}

}


// KELUAR

else{

if(index==-1){

alert("Barang tidak ada");

return;

}


if(data[index].stok<stok){

alert("Stok tidak cukup");

return;

}


let sisa=

data[index].stok

-

stok;


if(sisa<=0){

db.collection("gudang")

.doc(data[index].id)

.delete();

}

else{

db.collection("gudang")

.doc(data[index].id)

.update({

stok:sisa

});

}

}


// RIWAYAT

db.collection("riwayat")

.add({

tanggal:

new Date()

.toLocaleString("id-ID"),

nama,

warna,

jumlah:stok,

status:jenis

});


// KOSONGKAN

document.getElementById("nama").value="";

document.getElementById("warna").value="";

document.getElementById("stok").value="";

document.getElementById("lokasi").value="";

}


// =========================
// RENDER TABEL
// =========================

function render(){

let tbody=

document.getElementById("tbody");

let cari=

document.getElementById("search")

.value

.toLowerCase();


tbody.innerHTML="";


let total=0;

let peringatan="";


data.forEach((item)=>{

if(item.stok<=5){

peringatan +=

"⚠ "

+

item.nama

+

" "

+

item.warna

+

" ("

+

item.stok

+

")<br>";

}

});


document.getElementById("peringatanStok")

.innerHTML=

peringatan

||

"Semua stok aman";



for(

let i=0;

i<data.length;

i++

){

let d=data[i];


if(

!d.nama

.toLowerCase()

.includes(cari)

){

continue;

}


total+=Number(d.stok);


tbody.innerHTML += `

<tr>

<td>${i+1}</td>

<td>${d.nama}</td>

<td>${d.warna}</td>

<td>${d.stok}</td>

<td>${d.lokasi}</td>

<td>

${
isAdmin

?

`<button onclick="hapus('${d.id}')">

Hapus

</button>`

:

"-"

}

</td>

</tr>

`;

}


document.getElementById("jumlahBarang")

.innerText=data.length;


document.getElementById("totalStok")

.innerText=total;

}


// =========================
// RIWAYAT
// =========================

function renderRiwayat(){

let tbody=

document.getElementById("riwayatBody");

tbody.innerHTML="";


let masuk=0;

let keluar=0;


for(

let i=0;

i<riwayat.length;

i++

){

let r=riwayat[i];


if(r.status==="Masuk"){

masuk++;

}

else{

keluar++;

}


tbody.innerHTML += `

<tr>

<td>${r.tanggal}</td>

<td>${r.nama}</td>

<td>${r.warna}</td>

<td>${r.jumlah}</td>

<td>${r.status}</td>

</tr>

`;

}


document.getElementById("barangMasuk")

.innerText=masuk;


document.getElementById("barangKeluar")

.innerText=keluar;

}


// =========================
// HAPUS
// =========================

function hapus(id){

if(!isAdmin){

return;

}


if(

confirm("Yakin hapus?")

){

db.collection("gudang")

.doc(id)

.delete();

}

}


// =========================
// EXPORT CSV
// =========================

function exportCSV(){

let csv=

"No,Nama,Warna,Stok,Lokasi\n";


for(

let i=0;

i<data.length;

i++

){

let d=data[i];


csv +=

(i+1)

+ ","

+ d.nama

+ ","

+ d.warna

+ ","

+ d.stok

+ ","

+ d.lokasi

+ "\n";

}


let blob=

new Blob(

[csv],

{

type:"text/csv"

}

);


let a=

document.createElement("a");


a.href=

URL.createObjectURL(blob);


a.download=

"stok_gudang.csv";


a.click();


alert("Export berhasil");

}


// =========================
// START
// =========================

document.querySelector(".form-box")
.style.display="none";

loadData();

loadRiwayat();
