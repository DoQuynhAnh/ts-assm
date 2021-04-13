import Navbar from "../component/navbar";
import { $, reRender } from "../ultil";
import swal from "sweetalert";

export default class assignment {
  async render() {
    let listImg: string = "";

    const pokemons: number = 10;

    interface PokemonInterface {
      id: number;
      image: string;
    }

    let arrPokemon: PokemonInterface[] = [];

    for (let i = 1; i <= pokemons; i++) {
      let data: any = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      let pokemon: any = await data.json();
      arrPokemon = [
        ...arrPokemon,
        { id: pokemon.id, image: pokemon.sprites.front_default },
      ];
    }

    const cardPokemon: any = arrPokemon.concat(arrPokemon);

    cardPokemon.sort(() => {
      return Math.random() - 0.5;
    });

    cardPokemon.map((item: any, index: number) => {
      listImg += `<img src="${item.image}" id="${item.id}" index="${index}" class="poke border" height="150px">`;
    });

    $("#navbar").innerHTML = await Navbar.render();
    $(".point").style.display = "";
    $(".point").innerHTML = "Điểm: 0";

    return `
            ${listImg}
        `;
  }

  async afterRender() {
    let focusPokemon: HTMLElement[] = [];
    let totalPoint: number = 0;
    let countToEnd: number = 0;
    const userName: string = localStorage.getItem("user");
    const poke: HTMLElement[] = $(".poke");

    // Play Game
    poke.forEach((item: HTMLElement) => {
      item.addEventListener("click", () => {
        item.classList.add("pokeFocus");
        focusPokemon = [...focusPokemon, item];

        if (focusPokemon.length === 2) {

          if (
            focusPokemon[0].getAttribute("id") ==
              focusPokemon[1].getAttribute("id") &&
            focusPokemon[0].getAttribute("index") !=
              focusPokemon[1].getAttribute("index")
          ) {
            focusPokemon.forEach((item: HTMLElement) => {
              item.style.visibility = "hidden";
            });
            totalPoint += 100;
            countToEnd += 1;
          } else {
            focusPokemon.forEach((item) => {
              item.classList.remove("pokeFocus"); 
            });
            if (totalPoint > 0) {
              totalPoint -= 50; 
            }
          }

          focusPokemon = []; 

          $(".point").innerHTML = "Điểm: " + totalPoint;
        }

        if (countToEnd === 10) {
          swal(
            "Chúc mừng!",
            `${userName} đã dành chiến thắng với số điểm là: ${totalPoint}`
          );

          swal({
            title: "Bạn có muốn chơi lại",
            text: "Click outside to cancel",
            icon: "warning",
            dangerMode: false,
          }).then(async (willDelete: boolean) => {
            if (willDelete) {
              swal("Chơi lại thành công", {
                icon: "success",
              });
              reRender(Assignment, "#content");
            } else {
              swal("Bạn đã hủy!");
            }
          });

        }
      });
    });



    // play again
    const Assignment = new assignment();
    const restartBtn: HTMLElement = $("#navbar .restart");
    restartBtn.addEventListener("click", async function () {
      swal({
        title: "Bạn chắc chắn muốn chơi lại",
        text: "Click outside to cancel",
        icon: "warning",
        dangerMode: true,
      }).then(async (willDelete: boolean) => {
        if (willDelete) {
          swal("Chơi lại thành công", {
            icon: "success",
          });
          reRender(Assignment, "#content");
        } else {
          swal("Bạn đã hủy!");
        }
      });
    });

    // Đăng xuất game
    const logoutBtn: HTMLElement = $("#navbar .logout");
    logoutBtn.addEventListener("click", async function () {
      localStorage.removeItem("user"); 
      $("#navbar").innerHTML = "";
      window.location.hash = "";
    });
  }

  // const showStroke = (value) => {

  //   var c = document.getElementById("myCanvas");
  //   var ctx = c.getContext("2d");
  //   ctx.moveTo(49, 90);
  //   ctx.lineTo(350, 634);
  //   ctx.stroke();

  //   c.classList.add("custom")

  //   setTimeout(() => {
  //     c.classList.remove("custom")
  //   }, 3000)

  // }




  // const findPos = (element) => {
  //   var rect = element.getBoundingClientRect();
  //   console.log("top: " ,rect.top,"right: " , rect.right,"bottom: " , rect.bottom,"left: " , rect.left);
  //   let hypotenuse = Math.sqrt(Math.pow((rect.height), 2) + Math.pow((rect.width), 2))
  //   console.log(rect);
  //   console.log(hypotenuse);
  // }
}
