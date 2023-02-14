import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/user.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
})
export class UserHomeComponent implements OnInit, OnDestroy {
  user: any;
  options: google.maps.MapOptions | undefined;
  map: any;

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private router: Router,
    private socket: Socket,
  ) { }

  ngOnDestroy(): void {
    this.socket.disconnect();
    this.socket.removeAllListeners();
  }

  ngOnInit(): void {
    let token: string | null = window.localStorage.getItem('token');
    if (token) {
      this.bringLoggedInUserData(token);

      // const id = window.localStorage.getItem('token');
      this.orderService.getActiveSections(token!).subscribe((orders) => {
        // console.log("🚀 ~ file: user-home.component.ts:94 ~ UserHomeComponent ~ this.orderService.getActiveSections ~ data", data)

        // console.log(JSON.stringify(data))
        if (JSON.stringify(orders) === "[]") {
          console.log('n tem dado')
        } else {
          orders.map((order: any) => {
            console.log('tem dado')
            console.log(order)
            this.socket.connect();
            this.socket.on(order.section, (data: any) => {
              console.log(data);
            })
          })
        }
        // data.map((order) => {
        //   this.socket.connect();
        //   this.socket.on( ,(data: any) => {
        //       console.log(data);
        //     })
        // })

      })
    } else {
      this.router.navigate(['/login-user']);
    }
  }

  bringLoggedInUserData(id: string) {
    return this.userService.bringLoggedInUserData(id).subscribe((data) => {
      if (data.warehouse) {
        window.localStorage.removeItem('token');
        this.router.navigate(['/login-admin']);
      } else {
        this.user = data;
        const latLng = new google.maps.LatLng(
          this.user.position.latitude,
          this.user.position.longitude
        );

        const mapOptions = {
          zoom: 17,
          center: latLng,
        };
        const map = new google.maps.Map(
          document.getElementById('map')!,
          mapOptions
        );
        this.map = map;
        new google.maps.Marker({
          position: latLng,
          map: map,
          // icon: {
          //   path: 'M24 29.4q2.55 0 4.6-1.15t3.3-3.15q-1.7-1.25-3.675-1.9-1.975-.65-4.225-.65-2.25 0-4.2.65-1.95.65-3.65 1.9 1.25 2 3.275 3.15T24 29.4Zm0-10q1.45 0 2.45-1 1-1 1-2.4 0-1.45-1.025-2.45-1.025-1-2.425-1t-2.4 1.025q-1 1.025-1 2.425t1 2.4q1 1 2.4 1Zm0 20.7q6.65-6.05 9.875-11 3.225-4.95 3.225-8.7 0-5.95-3.8-9.725Q29.5 6.9 24 6.9q-5.5 0-9.275 3.775Q10.95 14.45 10.95 20.4q0 3.8 3.275 8.725T24 40.1Zm.05 3.2q-.3 0-.6-.1t-.55-.25q-7.45-6.55-11.125-12.125T8.1 20.4q0-7.45 4.8-11.9T24 4.05q6.35 0 11.15 4.425 4.8 4.425 4.8 11.925 0 4.8-3.675 10.4Q32.6 36.4 25.1 42.95q-.2.15-.475.25-.275.1-.575.1ZM24 20.4Z',
          //   strokeOpacity: 1,
          //   strokeWeight: 1,
          //   fillOpacity: 1,
          //   fillColor: '#FF5733',
          //   strokeColor: '#FF5733',
          // },
        });
      }
    });
  }

  makeOrder() {
    this.socket.connect();
    const sectionId = uuid.v4();
    console.log("🚀 ~ file: user-home.component.ts:115 ~ UserHomeComponent ~ makeOrder ~ sectionId", sectionId)
    this.socket.connect();
    const color = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
    this.socket.on(sectionId, (data: any) => {
      let drone: google.maps.Marker = new google.maps.Marker();
      console.log(Array.isArray(data.message));
      if (!Array.isArray(data.message) && data.message != true) {
        const latLng = new google.maps.LatLng(
          data.warehouse.position.latitude,
          data.warehouse.position.longitude
        );
        new google.maps.Marker({
          position: latLng,
          map: this.map,
          icon: {
            path: 'M24 9.1 6.95 15.95v23.1h6.15V25.8q0-1.2.825-2.05.825-.85 2.025-.85H32.1q1.15 0 2 .85.85.85.85 2.05v13.25h6.15v-23.1Zm-8.05 32.8h-9q-1.2 0-2.025-.825T4.1 39.05V16q0-.9.475-1.625T5.9 13.3l17.05-6.8q.55-.25 1.075-.25.525 0 1.025.25l17.1 6.8q.8.35 1.3 1.075t.5 1.625v23.05q0 1.2-.85 2.025t-2 .825h-9V25.8H15.95Zm2.65 0v-2.85h2.85v2.85Zm4-6v-2.85h2.85v2.85Zm4 6v-2.85h2.85v2.85Zm5.5-19H15.95 32.1Z',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillOpacity: 1,
            fillColor: '#FF5733',
            strokeColor: '#FF5733',
          },
        });

        let jumpPoints = 0;
        let jump = Math.floor(Math.random() * (25 - 15 + 1) + 15);
        data.route.map((latLngRoute: any) => {
          if (jumpPoints == 0) {
            const latLng = new google.maps.LatLng(latLngRoute[0], latLngRoute[1]);

            new google.maps.Marker({
              position: latLng,
              map: this.map,
              icon: {
                path: 'M10.021 13.833q-1.604 0-2.729-1.104t-1.125-2.708q0-1.625 1.104-2.74 1.104-1.114 2.708-1.114 1.625 0 2.74 1.104 1.114 1.104 1.114 2.708t-1.104 2.729q-1.104 1.125-2.708 1.125Z',
                strokeOpacity: 1,
                strokeWeight: 1,
                fillOpacity: 1,
                fillColor: `#${color}`,
              },
            });
          } if (jumpPoints == jump) {
            jumpPoints = 0;
          } else {
            jumpPoints += 1;
          }
        });
      } else if(data.message == true) {
        alert('Order delivered successfully.')
      } else {
        const latLng = new google.maps.LatLng(data.message[0], data.message[1]);
        drone = new google.maps.Marker({
            position: latLng,
            map: this.map,
            icon: {
              url: '/assets/icons/drone_order.svg',
              strokeOpacity: 1,
              strokeWeight: 1,
              fillOpacity: 1,
              fillColor: `#${color}`,
            },
          });
          setTimeout(() => {
            drone.setMap(null);
          }, 1000);
      }
    })

    this.socket.emit('message', {
      message: 'message',
      userId: this.user.id,
      sectionId: sectionId
    });



    // return this.orderService.makeOrder(id!).subscribe((data) => {
    //   console.log(
    //     '🚀 ~ file: user-home.component.ts:75 ~ UserHomeComponent ~ returnthis.orderService.makeOrder ~ data',
    //     data
    //   );
    //   // console.log(data.warehouse.position.latitude, data.warehouse.position.longitude);

    //   let jumpPoints = 0;
    //   let jump = Math.floor(Math.random() * (25 - 15 + 1) + 15);
    //   const color = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    //   data.route.map((latLngRoute: any) => {
    //     if (jumpPoints == 0) {
    //       const latLng = new google.maps.LatLng(latLngRoute[0], latLngRoute[1]);

    //       new google.maps.Marker({
    //         position: latLng,
    //         map: this.map,
    //         icon: {
    //           path: 'M10.021 13.833q-1.604 0-2.729-1.104t-1.125-2.708q0-1.625 1.104-2.74 1.104-1.114 2.708-1.114 1.625 0 2.74 1.104 1.114 1.104 1.114 2.708t-1.104 2.729q-1.104 1.125-2.708 1.125Z',
    //           strokeOpacity: 1,
    //           strokeWeight: 1,
    //           fillOpacity: 1,
    //           fillColor: `#${color}`,
    //           // strokeColor: '#FF5733',
    //         },
    //       });
    //     } if(jumpPoints == jump) {
    //       jumpPoints = 0;
    //     } else {
    //       jumpPoints += 1;
    //     }
    //   });

    //   const latLng = new google.maps.LatLng(
    //     data.warehouse.position.latitude,
    //     data.warehouse.position.longitude
    //   );

    //   new google.maps.Marker({
    //     position: latLng,
    //     map: this.map,
    //     icon: {
    //       path: 'M24 9.1 6.95 15.95v23.1h6.15V25.8q0-1.2.825-2.05.825-.85 2.025-.85H32.1q1.15 0 2 .85.85.85.85 2.05v13.25h6.15v-23.1Zm-8.05 32.8h-9q-1.2 0-2.025-.825T4.1 39.05V16q0-.9.475-1.625T5.9 13.3l17.05-6.8q.55-.25 1.075-.25.525 0 1.025.25l17.1 6.8q.8.35 1.3 1.075t.5 1.625v23.05q0 1.2-.85 2.025t-2 .825h-9V25.8H15.95Zm2.65 0v-2.85h2.85v2.85Zm4-6v-2.85h2.85v2.85Zm4 6v-2.85h2.85v2.85Zm5.5-19H15.95 32.1Z',
    //       strokeOpacity: 1,
    //       strokeWeight: 1,
    //       fillOpacity: 1,
    //       fillColor: '#FF5733',
    //       strokeColor: '#FF5733',
    //     },
    //   });
    // });
  }
}
