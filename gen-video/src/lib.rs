use ndarray::Array3;
use std::path::Path;
use video_rs::{
    encode::{Encoder, Settings},
    Time,
};

static mut ENCODER: Option<&mut Encoder> = None;

#[no_mangle]
pub fn new(height: usize, width: usize) {
    video_rs::init().unwrap();

    let settings = Settings::preset_h264_yuv420p(height, width, false);
    let encoder = Box::new(
        Encoder::new(Path::new("rainbow.mp4"), settings).expect("failed to create encoder"),
    );
    unsafe { ENCODER = Some(Box::leak(encoder)) };
}

#[no_mangle]
pub fn add_frame(frame: usize, arr: Array3<u8>) {
    let position = Time::from_secs_f64(frame as f64 / 24.0);
    unsafe {
        match ENCODER {
            Some(ref mut encoder) => encoder
                .encode(&arr, &position)
                .expect("failed to encode frame"),
            None => println!("No encoder found"),
        }
    };
}

#[no_mangle]
pub fn finish() {
    unsafe {
        match ENCODER {
            Some(ref mut encoder) => encoder.finish().expect("failed to finish encoder"),
            None => println!("No encoder found"),
        }
    };
}
