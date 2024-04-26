#[cfg(target_os = "windows")]
const PLATFORM: &str = "Windows";
#[cfg(target_os = "windows")]
const LIBRART_PATH: &str = "gen_video.dll";

#[cfg(target_os = "linux")]
const PLATFORM: &str = "Linux";
#[cfg(target_os = "linux")]
const LIBRART_PATH: &str = "libgen_video.so";

#[cfg(target_os = "macos")]
const PLATFORM: &str = "macOS";
#[cfg(target_os = "macos")]
const LIBRART_PATH: &str = "libgen_video.dylib";

#[allow(dead_code)]
const TEST_ERROR_PATH: &str = "libs/libtest_error";

use std::{env, path::Path};

use ndarray::Array3;

pub fn main() {
    env::set_current_dir(Path::new("libs")).unwrap();
    // print the current working directory
    println!("Video generated on {PLATFORM}!");
    println!(
        "Current working directory: {}",
        env::current_dir().unwrap().display()
    );
    let lib = unsafe { libloading::Library::new(LIBRART_PATH).unwrap() };

    let init = unsafe { lib.get::<fn(usize, usize)>(b"new\0").unwrap() };
    init(1280, 720);
    let add_frame = unsafe { lib.get::<fn(usize, Array3<u8>)>(b"add_frame\0").unwrap() };
    let finish = unsafe { lib.get::<fn()>(b"finish\0").unwrap() };

    for i in 0..256 {
        let frame = rainbow_frame(i as f32 / 256.0);
        add_frame(i, frame);
    }

    finish();
    lib.close().unwrap();
}

fn rainbow_frame(p: f32) -> Array3<u8> {
    // This is what generated the rainbow effect! We loop through the HSV color spectrum and convert
    // to RGB.
    let rgb = hsv_to_rgb(p * 360.0, 100.0, 100.0);

    // This creates a frame with height 720, width 1280 and three channels. The RGB values for each
    // pixel are equal, and determined by the `rgb` we chose above.
    Array3::from_shape_fn((720, 1280, 3), |(_y, _x, c)| rgb[c])
}

fn hsv_to_rgb(h: f32, s: f32, v: f32) -> [u8; 3] {
    let s = s / 100.0;
    let v = v / 100.0;
    let c = s * v;
    let x = c * (1.0 - (((h / 60.0) % 2.0) - 1.0).abs());
    let m = v - c;
    let (r, g, b) = if (0.0..60.0).contains(&h) {
        (c, x, 0.0)
    } else if (60.0..120.0).contains(&h) {
        (x, c, 0.0)
    } else if (120.0..180.0).contains(&h) {
        (0.0, c, x)
    } else if (180.0..240.0).contains(&h) {
        (0.0, x, c)
    } else if (240.0..300.0).contains(&h) {
        (x, 0.0, c)
    } else if (300.0..360.0).contains(&h) {
        (c, 0.0, x)
    } else {
        (0.0, 0.0, 0.0)
    };
    [
        ((r + m) * 255.0) as u8,
        ((g + m) * 255.0) as u8,
        ((b + m) * 255.0) as u8,
    ]
}
