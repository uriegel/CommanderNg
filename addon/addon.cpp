#include <nan.h>
#include <string>
#include "IconExtractor.h"
#include "Worker.h"
#include "utf8.h"
using namespace std;
using namespace Nan;
using namespace v8;

NAN_METHOD(GetIcon) {
	Utf8String val(To<String>(info[0]).ToLocalChecked());
	auto extension = Utf8Decode(*val);

	auto callback = new Callback(info[1].As<Function>());
	auto icon = new vector<char>;
	AsyncQueueWorker(new Worker(callback, 
		[extension, icon]()-> void {
			GdiPlusInitialize();
			ExtractIcon(extension, *icon);
			GdiPlusUninitialize();
		}, [icon](Nan::Callback* callback)-> void {
			auto bytes = NewBuffer(icon->data(), icon->size(),
				[](char*, void* theVector) { delete reinterpret_cast<vector<char>*>(theVector); },
				icon).ToLocalChecked();
			Local<Value> argv[] = { Nan::Null(), bytes };
			Call(*callback, 2, argv).ToLocalChecked();
		}
	));
}

NAN_METHOD(GetTest) {
	Utf8String val(To<String>(info[0]).ToLocalChecked());
	auto input = Utf8Decode(*val);

    info.GetReturnValue().Set(New<String>("das Ergebnis").ToLocalChecked());
}

NAN_METHOD(GetTestAsync) {
	Utf8String val(To<String>(info[0]).ToLocalChecked());
	auto input = Utf8Decode(*val);

    auto callback = new Callback(info[1].As<Function>());
    AsyncQueueWorker(new Worker(callback, 
		[]()-> void { Sleep(); }, 
		[](Nan::Callback* callback)-> void {
			Local<Value> argv[] = { Nan::Null(), New<String>("das Ergebnis mit Verzögerung").ToLocalChecked() };
			Call(*callback, 2, argv).ToLocalChecked();
		}
	));    
}

NAN_MODULE_INIT(init) {
    Nan::Set(target, New<String>("getIcon").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetIcon)).ToLocalChecked());
	Nan::Set(target, New<String>("getTest").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetTest)).ToLocalChecked());
    Nan::Set(target, New<String>("getTestAsync").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetTestAsync)).ToLocalChecked());
}

NODE_MODULE(addon, init)