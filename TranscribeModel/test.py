import torch

if torch.cuda.is_available():
    print("CUDA for GPU");
else: 
    print("Not Available");

