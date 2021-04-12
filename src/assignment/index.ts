import Navbar from "../component/navbar";
import { $, reRender } from "../ultil";
import swal from "sweetalert";

export default class assignment {
  async render() {
    let result: string = "";

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
      result += `<img src="${item.image}" id="${item.id}" index="${index}" class="poke border" height="150px">`;
    });

    $("#navbar").innerHTML = await Navbar.render();
    $(".point").style.display = "";
    $(".point").innerHTML = "Điểm: 0";

    return `
            ${result}
        `;
  }

  async afterRender() {
    let focusPokemon: HTMLElement[] = [];
    let count: number = 0;
    let totalPoint: number = 0;
    let countDuplicatePokemon: number = 0;
    const userName: string = localStorage.getItem("user");
    const poke: HTMLElement[] = $(".poke");

    // Play Game
    poke.forEach((item: HTMLElement) => {
      item.addEventListener("click", () => {
        item.classList.add("pokeFocus");
        focusPokemon = [...focusPokemon, item];
        count++;

        if (count >= 2) {
          count = 0;

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
            countDuplicatePokemon += 1;
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

        if (countDuplicatePokemon === 10) {
          swal(
            "Chúc mừng!",
            `${userName} đã dành chiến thắng với số điểm là: ${totalPoint}`
          );
        }
      });
    });

  //   const getCoordinates = (elem) => {
  //     var LeftPos = elem.offsetLeft;
  //     var TopPos = elem.offsetTop;
  //     return {X:LeftPos,Y:TopPos};
  // }

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
}
